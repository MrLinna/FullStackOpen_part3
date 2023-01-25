require('dotenv').config()
const Contact = require('./models/contact')
const express = require('express')
const app = express()
app.use(express.json())
var morgan = require('morgan')

const cors = require('cors')
const { response } = require('express')
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
    },  
    {    
        id: 5,    
        name: "These numbers come from backend's index.js",    
        number: "9876"  
    }
]

app.get('/api/persons', (req, res) => {
    Contact.find({}).then(contacts=>{
        res.json(contacts)
    })
})

// counts contacts in this file
app.get('/info', (req, res) => {
    res.send(`
        <p>Phonebook has info for ${contacts.length} people</p>
        <p>${Date()}</p>
    `)
})

app.get('/api/persons/:id', (req, res) => {
    Contact.findById(req.params.id).then(note => {
        res.json(note)
    })
})

app.delete('/api/persons/:id', (req, res)=> {
    const id = Number(req.params.id)
    contacts = contacts.filter(contact => contact.id !== id)
    res.status(204).end()
})


app.post("/api/persons", (req, res) => {
    const body = req.body
    if (body.name === undefined || body.number === undefined){
        return res.status(400).json({error: 'name or number missing'})
    }
    
    const contact = new Contact({
        name:  body.name,
        number: body.number
    })

    contact.save().then(savedContact => {
        response.json(savedContact)
    })
})

const PORT = process.env.PORT //|| 3001
    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

