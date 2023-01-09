const http = require('http')
const express = require('express')
const app = express()
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

const PORT = 3001
    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

