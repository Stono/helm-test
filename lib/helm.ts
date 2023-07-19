import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import * as randomstring from 'randomstring'
import { Exec } from './exec'
import { Logger } from './logger'
import type { IPhaseOneParser, IPhaseTwoParser } from './resultsParsers'
import { HelmResultParser } from './resultsParsers/helm'
import { IstioCtlResultsParser } from './resultsParsers/istioctl'
import { KubeValResultsParser } from './resultsParsers/kubeval'

export class Helm {
  private readonly helmBinary = process.env.HELM_BINARY
    ? process.env.HELM_BINARY
    : 'helm'
  private readonly command = `${this.helmBinary} template --namespace default release-name .`
  private files: string[] = []
  private sets: string[] = []
  private readonly exec: Exec

  private readonly logger: Logger
  private readonly phase1: IPhaseOneParser[] = []
  private readonly phase2: IPhaseTwoParser[] = []

  constructor() {
    this.exec = new Exec()
    this.logger = new Logger({ namespace: 'helm' })
    this.phase1.push(new HelmResultParser())

    if (KubeValResultsParser.ENABLED) {
      this.phase2.push(new KubeValResultsParser())
    }

    if (IstioCtlResultsParser.ENABLED) {
      this.phase2.push(new IstioCtlResultsParser())
    }
  }

  public withValueFile(valueFile: string): Helm {
    const pathToValueFile = path.join(process.cwd(), valueFile)
    this.files.push(pathToValueFile)
    return this
  }

  public set(key: string, value: unknown): Helm {
    if (Array.isArray(value)) {
      this.sets.push(`${key}={${value.join(',')}}`)
    } else {
      this.sets.push(`${key}=${value}`)
    }
    return this
  }

  public async go(done?: (err?: Error) => void): Promise<void> {
    let filename: string | null = null

    try {
      let command = this.command
      if (this.files.length > 0) {
        command = `${command} -f ${this.files.join(' -f ')}`
      }
      if (this.sets.length > 0) {
        command = `${command} --set ${this.sets.join(' --set ')}`
      }

      this.files = []
      this.sets = []

      const result = await this.exec.command(command, { throw: true })

      if (IstioCtlResultsParser.ENABLED || KubeValResultsParser.ENABLED) {
        filename = path.join(
          os.tmpdir(),
          randomstring.generate({
            length: 20,
            charset: 'alphabetic'
          })
        )
        fs.writeFileSync(filename, result.stdout)
      }

      await Promise.all(
        this.phase1.map(async (parser) => {
          this.logger.debug(
            `running results parser: ${parser.constructor.name}`
          )
          await parser.parse({ result })
        })
      )

      await Promise.all(
        this.phase2.map(async (parser) => {
          this.logger.debug(
            `running results parser: ${parser.constructor.name}`
          )
          await parser.parse({ result, onDisk: filename as string })
        })
      )

      if (done) {
        done()
      }
    } catch (ex) {
      this.logger.error(ex.message)
      if (filename) {
        fs.unlinkSync(filename)
      }
      if (done) {
        done(ex)
      }
    } finally {
      if (filename) {
        fs.unlinkSync(filename)
      }
    }
  }
}
