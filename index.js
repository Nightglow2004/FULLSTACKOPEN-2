const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())

app.use(cors())

app.use(express.static('dist'))
 
morgan.token('body', (req) => req.method === 'POST' ? JSON.stringify(req.body) : '');

app.use((req, res, next) => {
    req.method === 'POST'
        ? morgan(':method :url :status :res[content-length] - :response-time ms :body')(req, res, next)
        : morgan('tiny')(req, res, next);
});

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    console.log(persons);
    response.json(persons);
})

app.get('/info', (request, response) => {
    let count = persons.length
    console.log(count);
    const now = new Date();
    const date = now.toString()
    response.send(`<p>Phonebook has info for ${count} people <br /> ${date}</p>`);
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const person = persons.find(person => person.id === id);

    if (person) {
        console.log(person);
        response.json(person);
    }
    else {
        console.log("error");
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const find = persons.find(person => person.id === id)

    if (find) {
        persons = persons.filter(person => person.id !== id)
        console.log(persons);
        response.status(204).end()
    }
    else {
        response.status(404).end()
    }
})

const generateId = () => {
    let newId;
    do {
        newId = String(Math.floor(Math.random() * 10000));
    } while (persons.some(person => person.id === newId));
    return newId
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(body);

    if (!body.name) {
        return response.status(400).json({
            error: 'name is missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number is missing'
        })
    }

    if(persons.some(person=>person.name===body.name)){
        return response.status(400).json({
            error: 'name must be unique !'
        })
    }
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)

    response.status(201).json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})