import app from './app'
import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT || 8000

const listener = () => console.log(`Listening on Port ${PORT}!`)
app.listen(PORT, listener)
