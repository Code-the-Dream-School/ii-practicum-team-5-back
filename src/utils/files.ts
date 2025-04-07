import path from 'path'
import { fileURLToPath, URL } from 'url'

export const getDirPath = (url: string | URL) => {
  const __filename = fileURLToPath(url)
  const __dirname = path.dirname(__filename)
  return __dirname
}
