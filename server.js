const app = require('./app')

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log(`moviedex is listening at http://localhost:${PORT}/movie`)
})