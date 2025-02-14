import express from 'express'
import { usersRoutes } from './http/controllers/users/routes'

export const app = express()

app.use(express.json())
app.use(usersRoutes)
