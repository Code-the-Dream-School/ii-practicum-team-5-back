const { PORT = 8000 } = process.env
import app from './app'

const listener = () => console.log(`Listening on Port ${PORT}!`)
app.listen(PORT, listener)
