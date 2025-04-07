import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

import mainController from '../controllers/mainController.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

router.get('/', mainController)

// loads all routes
const loadRoutes = async () => {
  const files = await fs.readdir(__dirname)

  for (const file of files) {
    const fullPath = path.join(__dirname, file)

    const stat = await fs.stat(fullPath)
    const isRouteFile = stat.isFile() && file !== 'index.ts' && file.endsWith('.ts')

    if (isRouteFile) {
      try {
        const module = await import(pathToFileURL(fullPath).href)
        if (module.default) {
          const routePath = `/${path.basename(file, path.extname(file))}`
          router.use(routePath, module.default)
        }
      } catch (err) {
        console.error(`Failed to load router from ${file}:`, err)
      }
    }
  }
}

await loadRoutes()
export default router
