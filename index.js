const http = require('http')
const express = require('express')
const app = express()
app.use(express.json())
var morgan = require('morgan')

const cors = require('cors')
app.use(cors())

app.use(express.static('build'))

morgan.token('contact', (req) => {
    if (req.method === "POST"){
        return JSON.stringify(req.body)
    }
    return "" 
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :contact'))

let contacts = [  
    {    
        id: 1,    
        name: "Arto Hellas",    
        number: "040-123456" 
    },  
    {    
        id: 2,    
        name: "Ada Lovelance",    
        number: "39-44-5323523"    
            
    },  
    {    
        id: 3,    
        name: "Dan Abramov",    
        number: "12-43-234345"  
    },  
    {    
        id: 4,    
        name: "Mary Poppendick",    
        number: "39-23-6423122"  
    }
]

app.get('/api/persons', (req, res) => {
    res.json(contacts)
})

app.get('/info', (req, res) => {
    res.send(`
        <p>Phonebook has info for ${contacts.length} people</p>
        <p>${Date()}</p>
    `)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const contact = contacts.find(contact => contact.id === id)
    if (contact){
        res.json(contact)
    }
    else{
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res)=> {
    const id = Number(req.params.id)
    contacts = contacts.filter(contact => contact.id !== id)
    res.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random()*1000)
  }

app.post("/api/persons", (req, res) => {
    const body = req.body
    if(!body.name || !body.number){
        return res.status(400).json({ 
            error: 'name or number missing' 
        })
    }
    
    const existsAlready = contacts.filter(contact => contact.name === body.name).length > 0

    if (existsAlready){
        return res.status(409).json({ 
            error: 'name must be unique' 
        })
    }
    const contact ={
        id: generateId(),
        name: body.name,
        number: body.number
    }
    contacts = contacts.concat(contact)
    res.json(contact)
})

const PORT = process.env.PORT || 3001
    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

