import process from 'node:process'
import mri from 'mri'
import { helpMessage } from './constants'

interface Options {
  template?: string
  help?: boolean
  overwrite?: boolean
  immediate?: boolean
  interactive?: boolean
}

const argv = mri<Options>(process.argv.slice(2), {
  boolean: ['help', 'overwrite', 'immediate', 'rolldown', 'interactive'],
  alias: { h: 'help', t: 'template', i: 'immediate' },
  string: ['template'],
})

async function init() {
  const help = argv.help

  if (help) {
    console.log(helpMessage)
    return false
  }
}

init()
