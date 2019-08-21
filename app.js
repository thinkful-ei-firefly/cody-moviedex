// require(import) modules
require('dotenv').config() // reads the .env file for API_TOKEN
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')

// get movies
const moviesJson = require('./movies')

// create express server
const app = express()

// include middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(cors())
app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN // getting token from .env
  const authToken = req.get('Authorization') // getting Authorization from?
  // checking if req.get token is same as local token
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized Request' })
  }
  // else it worked out so got to next
  next()
})

app.get('/movie', (req, res) => {
  // console.log('req: ', req.query)
  const { genre, country, avg_vote } = req.query

  // deconstruct moviesJson to mutable movies list
  let movies = [...moviesJson]

  if (genre) {
    // console.log('genre: ', genre)
    // ['animation','drama', 'romantic', 'comedy', 'spy', 'crime', 'thriller', 'adventure', 'documentary', 'horror']
    movies = movies.filter(movie => {
      // console.log(movie.genre.toLowerCase() === genre.toLowerCase())
      return movie.genre.toLowerCase() === genre.toLowerCase()
    })
    // console.log(movies)
    // res.status(200).send(movies)
    // return
  }
  if (country) {
    console.log('country: ', country)
    movies = movies.filter(movie => {
      return movie.country.toLowerCase() === country.toLowerCase()
    })
    // return
  }
  if (avg_vote) {
    console.log('avg_vote: ', avg_vote)
    movies = movies.filter(movie => {
      return parseFloat(movie.avg_vote) >= parseFloat(avg_vote)
    })
    // return
  }

  res.status(200).send(movies)
})

app.listen(8080, () => {
  console.log('moviedex is listening at http://localhost:8080/movie')
})
