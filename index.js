require('dotenv').config()
const Contact = require('./models/contact')
const express = require('express')
const app = express()
app.use(express.json())
var morgan = require('morgan')

const cors = require('cors')
app.use(cors())

app.use(express.static('build'))

morgan.token('contact', (req) => {
  if (req.method === 'POST'){
    return JSON.stringify(req.body)
  }
  return ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :contact'))

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}


app.get('/api/persons', (req, res) => {
  Contact.find({}).then(contacts => {
    res.json(contacts)
  })
})

app.get('/info', (req, res) => {
  Contact.find({}).then(contacts => {
    res.send(`
            <p>Phonebook has info for ${contacts.length} people</p>
            <p>${Date()}</p>
        `)
  })

})

app.get('/api/persons/:id', (req, res, next) => {
  Contact.findById(req.params.id)
    .then(note => {
      if(note){
        res.json(note)
      }
      else{
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Contact.findByIdAndRemove(req.params.id)
    .then(res => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  if (body.name === undefined || body.number === undefined){
    return res.status(400).json({ error: 'name or number missing' })
  }

  const contact = new Contact({
    name: body.name,
    number: body.number
  })

  contact.save()
    .then(savedContact => {
      res.json(savedContact)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id',(req,res, next) => {
  const { name, number } = req.body

  Contact.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runvalidators: true, context: 'query' }
  )
    .then (updatedContact => {
      res.json(updatedContact)
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

