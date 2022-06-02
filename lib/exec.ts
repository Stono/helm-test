import * as ChildProcess from 'child_process'
import { Logger } from './logger'

const spawn = ChildProcess.spawn

export interface IExecResult {
  stdout: string
  stderr: string
  code: number
}

type ExecOptions = { output?: boolean; cwd?: string; throw?: boolean }

const generateSpawnOptions = (
  stdout: boolean
): ChildProcess.SpawnOptionsWithoutStdio => {
  const spawnOpts: ChildProcess.SpawnOptionsWithoutStdio = {
    stdio: [
      process.stdin as never,
      process.stdout as never,
      process.stderr as never
    ]
  }

  if (!stdout) {
    spawnOpts.stdio = [process.stdin as never, 'pipe', 'pipe']
  }
  return spawnOpts
}

export class Exec {
  private readonly process: NodeJS.Process
  private readonly logger: Logger

  constructor(proc?: NodeJS.Process) {
    this.logger = new Logger({ namespace: 'exec' })
    this.process = proc || process
  }

  public command(
    command: string | string[],
    options?: ExecOptions
  ): Promise<IExecResult> {
    this.logger.debug(Array.isArray(command) ? command.join(' ') : command)
    const args = command instanceof Array ? command : command.split(' ')
    const root = args.shift() as string
    return this.async(root, args, options)
  }

  private async(
    root: string,
    args: string[],
    options?: ExecOptions
  ): Promise<IExecResult> {
    return new Promise((resolve, reject) => {
      let stdout = ''
      let stderr = ''

      const spawnOpts = generateSpawnOptions(options?.output ?? false)
      if (options?.cwd) {
        spawnOpts.cwd = options.cwd
      }

      const proc = spawn(root, args, spawnOpts)
      if (!options?.output) {
        proc.stdout.on('data', (data) => {
          stdout += data.toString()
        })
        proc.stderr.on('data', (data) => {
          stderr += data.toString()
        })
      }
      proc.on('error', (err) => {
        reject(err)
      })

      proc.on('exit', (code) => {
        let err: Error | null = null
        if (code === null || typeof code === 'undefined') {
          err = new Error('No exit code returned from exec')
        } else if (code !== 0) {
          err = new Error(stderr.trim())
        }

        const shouldThrow = options?.throw ?? true
        if (err && shouldThrow) {
          return reject(err)
        }

        return resolve({
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          code: code as number
        })
      })
    })
  }
}
