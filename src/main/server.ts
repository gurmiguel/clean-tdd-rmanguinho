import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'
import env from './config/env'

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const { app } = await import('./config/app')
    app.listen(env.port, () => console.log(`Server running at http://localhost:${env.port.toString()}`))
  })
  .catch(console.error)
