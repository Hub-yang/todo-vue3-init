import colors from 'picocolors'

const {
  blue,
  blueBright,
  cyan,
  green,
  magenta,
  red,
  redBright,
  yellow,
} = colors

export const helpMessage = `\
用法: hubery-create [OPTION]... [DIRECTORY]

创建通用模板

Options:
  -t, --template                        使用指定模板
  -i, --immediate                       安装依赖并执行
  --interactive / --no-interactive      交互模式切换

可用模板:
${yellow ('vanilla-ts          vanilla')}
${green ('vue-ts              vue')}
${cyan ('react-ts            react')}
${cyan ('react-compiler-ts   react-compiler')}
${cyan ('react-swc-ts        react-swc')}
${magenta ('preact-ts           preact')}
${redBright ('lit-ts              lit')}
${red ('svelte-ts           svelte')}
${blue ('solid-ts            solid')}
${blueBright('qwik-ts             qwik')}`

export const defaultTargetDir = 'vite-project'
