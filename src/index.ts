import fs from 'node:fs'
import process from 'node:process'
import * as prompts from '@clack/prompts'
import { determineAgent } from '@vercel/detect-agent'
import mri from 'mri'
import { defaultTargetDir, helpMessage } from './constants'
import { cancel, emptyDir, formatTargetDir, isEmpty, pkgFromUserAgent } from './utils'

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
  const argTargetDir = argv._[0] ? formatTargetDir(String(argv._[0])) : undefined
  // const argTemplate = argv.template
  const argOverwrite = argv.overwrite
  // const argImmediate = argv.immediate
  const argInteractive = argv.interactive

  const help = argv.help
  if (help) {
    console.log(helpMessage)
    return false
  }

  const interactive = argInteractive ?? process.stdin.isTTY
  // 检测 AI 代理环境，以获得更好的代理体验 (AX)
  const { isAgent } = await determineAgent()

  if (isAgent && interactive) {
    // 要一次性创建项目，请运行：create-vite <目录> --no-interactive --template <模板>
    console.log('\nTo create in one go, run: create-vite <DIRECTORY> --no-interactive --template <TEMPLATE>\n')
  }

  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)

  console.log('pkgInfo :>>> ', pkgInfo)

  // 1.获取项目名称和目标目录
  let targetDir = argTargetDir
  if (!targetDir) {
    if (interactive) {
      const projectName = await prompts.text({
        message: '项目名称:',
        defaultValue: defaultTargetDir,
        placeholder: defaultTargetDir,
        validate(value) {
          return !value || formatTargetDir(value).length > 0 ? undefined : '项目名称无效'
        },
      })

      if (prompts.isCancel(projectName)) {
        return cancel()
      }

      targetDir = formatTargetDir(projectName)
    }
    else {
      targetDir = defaultTargetDir
    }
  }

  // 2.如果目录存在且不为空，则进行处理
  if (fs.existsSync(targetDir) && !isEmpty(targetDir)) {
    let overwrite: 'yes' | 'no' | 'ignore' | undefined = argOverwrite ? 'yes' : undefined

    if (!overwrite) {
      if (interactive) {
        const res = await prompts.select({
          message: `${targetDir === '.' ? '当前目录' : `目标目录 "${targetDir}"`} 不为空，请选择如何继续`,
          options: [
            {
              label: '取消操作',
              value: 'no',
            },
            {
              label: '删除现有文件并继续',
              value: 'yes',
            },
            {
              label: '忽略文件并继续',
              value: 'ignore',
            },
          ],
        })
        if (prompts.isCancel(res)) {
          return cancel()
        }

        overwrite = res
      }
      else {
        overwrite = 'no'
      }
    }

    switch (overwrite) {
      case 'yes':
        emptyDir(targetDir)
        break
      case 'no':
        cancel()
        break
    }
  }
}

init()
