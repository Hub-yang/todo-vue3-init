import fs from 'node:fs'
import path from 'node:path'
import * as prompts from '@clack/prompts'

interface PkgInfo {
  name: string
  version: string
}

/**
 * 移除末尾'/'
 */
export function formatTargetDir(targetDir: string) {
  return targetDir.trim().replace(/\/+$/g, '')
}

export function pkgFromUserAgent(userAgent: string | undefined): PkgInfo | undefined {
  if (!userAgent) {
    return undefined
  }

  const pkgSpec = userAgent.split(' ')[0]
  const pkgSpecArr = pkgSpec.split('/')
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  }
}

export function cancel() {
  return prompts.cancel('操作已取消')
}

/**
 * 检测目录是否为空
 */
export function isEmpty(path: string) {
  const files = fs.readdirSync(path)
  return files.length === 0 || (files.length === 1 && files[0] === '.git')
}

/**
 * 删除目录下除‘.git’的所有文件和文件夹
 */
export function emptyDir(dir: string) {
  if (!fs.existsSync(dir)) {
    return false
  }

  for (const file of fs.readdirSync(dir)) {
    if (file === '.git') {
      continue
    }
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true })
  }
}
