import * as xlsx from 'xlsx'

import { Agent } from './agent/agent'

export interface AgentLog {
  offencesTotal: number
  targettedTotal: number
}

export class Recorder {

  private logs: AgentLog[][]

  constructor(agentCount: number) {
    this.logs = new Array(agentCount)
    for (let i = 0; i < this.logs.length; i++) {
      this.logs[i] = []
    }
    this.onDayEnded()
  }

  onDayEnded(): void {
    for (const log of this.logs) {
      log.push({
        offencesTotal: 0,
        targettedTotal: 0,
      })
    }
  }

  write(): ArrayBuffer {
    const workbook = xlsx.utils.book_new()
    let id = 0
    for (const agentLogs of this.logs) {
      const sheet = xlsx.utils.json_to_sheet(agentLogs)
      xlsx.utils.book_append_sheet(workbook, sheet, `Agent ${id}`)
      id += 1
    }

    const data = xlsx.write(workbook, {
      type: 'binary',
      bookType: 'xlsx',
      bookSST: false,
    })

    const buffer = new ArrayBuffer(data.length)
    const view = new Uint8Array(buffer)
    for (let i = 0; i < data.length; i++) {
      // tslint:disable-next-line:no-bitwise
      view[i] = data.charCodeAt(i) & 0xff
    }

    // return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    return buffer
  }

  robbery(offender: Agent, target: Agent): void {
    const offenderLog = this.getLog(offender)
    const targetLog = this.getLog(target)

    offenderLog.offencesTotal += 1
    targetLog.targettedTotal += 1
  }

  private getLog(agent: Agent): AgentLog {
    const id = agent.id
    const logs = this.logs[id]
    return logs[logs.length - 1]
  }

}
