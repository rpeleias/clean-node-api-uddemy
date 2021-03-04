import { Express, Router } from 'express'
import { readdirSync } from 'fs'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  readdirSync(`${__dirname}`.concat('/../routes')).map(async file => {
    if (!file.endsWith('.map') && !file.includes('.test.')) {
      (await import(`../routes/${file}`)).default(router)
    }
  })
}
