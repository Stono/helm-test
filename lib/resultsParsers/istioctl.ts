import type { IPhaseOneParser, PhaseTwoOptions } from '.'
import { Exec } from '../exec'
import { Logger } from '../logger'

export class IstioCtlResultsParser implements IPhaseOneParser {
  public static readonly ENABLED =
    process.env.HELM_TEST_ISTIOCTL_ENABLED === 'true'
  private logger: Logger
  private readonly istioctlBinary: string = 'istioctl'
  private readonly exec: Exec
  constructor() {
    this.logger = new Logger({ namespace: 'istioctl-parser' })

    const istioctlBinary = process.env.ISTIOCTL_BINARY
    if (typeof istioctlBinary === 'string') {
      this.istioctlBinary = istioctlBinary
    }

    this.exec = new Exec()
  }

  public async parse({ onDisk }: PhaseTwoOptions): Promise<void> {
    this.logger.debug('running istioctl validate')
    const command = `${this.istioctlBinary} validate -f ${onDisk}`
    await this.exec.command(command, { throw: true })
  }
}
