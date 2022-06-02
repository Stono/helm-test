/* eslint-disable @typescript-eslint/no-explicit-any */
import * as async from 'async'
import * as YAML from 'js-yaml'
import type { IPhaseOneParser, PhaseOneOptions } from '.'
import { Logger } from '../logger'

declare var global: {
  results: { length: number; byType: any; ofType: (type: string) => any[] }
}

export class HelmResultParser implements IPhaseOneParser {
  private logger: Logger
  constructor() {
    this.logger = new Logger({ namespace: 'helm-parser' })
    global.results = {
      byType: [],
      ofType: (type): any[] => {
        if (Object.keys(global.results.byType).indexOf(type) > -1) {
          return global.results.byType[type]
        }
        return []
      },
      length: 0
    }
  }

  public async parse({ result }: PhaseOneOptions): Promise<void> {
    global.results.byType = []
    global.results.length = 0
    const removeNonManifests = (manifest: string): boolean => {
      return manifest.length > 0
    }

    const manifests = result.stdout.split(/\r?\n---/).filter(removeNonManifests)

    const parseToJson = (
      manifest: string,
      nextManifest: async.ErrorCallback
    ): void => {
      const sourceLine = manifest.split('\n').find((l) => {
        return l.startsWith('# Source')
      })
      let source
      if (sourceLine) {
        source = sourceLine.replace('# Source: ', '')
      }
      let json: any | undefined | null
      try {
        if (!manifest.includes('apiVersion')) {
          nextManifest()
          return
        }
        json = YAML.load(manifest)
      } catch (ex) {
        this.logger.error(`Failed to parse manifest: ${source}`)
        this.logger.error(ex.message)
        nextManifest(new Error('Unable to parse manifest'))
        return
      }
      if (!json || !json.kind) {
        nextManifest()
        return
      }
      if (typeof global.results.byType[json.kind] === 'undefined') {
        global.results.byType[json.kind] = []
      }
      global.results.length += 1
      global.results.byType[json.kind].push(json)
      nextManifest()
    }

    await async.each(manifests, parseToJson)
  }
}
