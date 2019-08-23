// require(import) modules
require('dotenv').config() // reads the .env file for API_TOKEN
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')

// get movies
const moviesJson = require('./movies')

// check if we are in production if true return tiny(less info) else 'common' more info
const morgan = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'

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
  const { genre, country, avg_vote } = req.query

  // deconstruct moviesJson to mutable movies list
  let movies = [...moviesJson]

  if (genre) {
    // ['animation','drama', 'romantic', 'comedy', 'spy', 'crime', 'thriller', 'adventure', 'documentary', 'horror']
    movies = movies.filter(movie => {
      return movie.genre.toLowerCase() === genre.toLowerCase()
    })
    // res.status(200).send(movies)
    // return
  }
  if (country) {
    movies = movies.filter(movie => {
      return movie.country.toLowerCase() === country.toLowerCase()
    })
    // return
  }
  if (avg_vote) {
    movies = movies.filter(movie => {
      return parseFloat(movie.avg_vote) >= parseFloat(avg_vote)
    })
    // return
  }

  res.status(200).send(movies)
})

// 4 params middleware, express knows this is an error handler
app.use((error, req, res, next) => {
  let response
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    response = { error }
  }
  res.status(500).json(response)
})

module.exports = app
