require('dotenv').config()

const e = require('express')
const mongoose = require('mongoose')


const url = process.env.MONGODB_URI
mongoose.set('strictQuery', false)
mongoose.connect(url)

const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

if (process.argv.length == 2){
    console.log('phonebook:')
    Contact.find({}).then(result => {
        result.forEach(contact => {
          console.log(contact.name, contact.number)
        })
        mongoose.connection.close()
    })
}
// if name and number are given as parameters
else{
    const name = process.argv[2]
    const number = process.argv[3]
    const contact = new Contact({
        name: name,
        number: number,
    })  

    contact.save().then(result => {
        console.log(`added ${name, number} to phonebook`)
        mongoose.connection.close()

    })
}


