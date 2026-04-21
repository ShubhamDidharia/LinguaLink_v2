const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 8000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Hello from backend' })
})

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})
