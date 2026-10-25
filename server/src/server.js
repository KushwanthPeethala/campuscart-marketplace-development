import mongoose from 'mongoose'
import { env } from './config/env.js'
import { connectDB } from './config/db.js'
import { app } from './app.js'

try {
  await connectDB()
} catch (err) {
  console.error('Could not connect to MongoDB:', err.message)
  process.exit(1)
}

const server = app.listen(env.port, () => console.log(`CampusCart API listening on ${env.serverUrl} (${env.nodeEnv})`))

const shutdown = (signal) => {
  console.log(`${signal} received, shutting down`)
  server.close(async () => {
    await mongoose.connection.close()
    process.exit(0)
  })
}
process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
