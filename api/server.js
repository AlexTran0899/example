const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const db = require('./data/db-config')
const path = require('path')


function getAllUsers() { return db('users') }

async function insertUser(user) {
  // WITH POSTGRES WE CAN PASS A "RETURNING ARRAY" AS 2ND ARGUMENT TO knex.insert/update
  // AND OBTAIN WHATEVER COLUMNS WE NEED FROM THE NEWLY CREATED/UPDATED RECORD
  const [newUserObject] = await db('users').insert(user, '*')
  return newUserObject 
}
const server = express()

server.use(express.static(path.join(__dirname, '../build')))
server.use(express.json())

server.use(helmet())
server.use(cors())


server.get('/api/users', async (req, res) => {
  res.json(await getAllUsers())
})

server.post('/api/users', async (req, res) => {
  res.status(201).json(await insertUser(req.body))
})



server.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'))
})

module.exports = server
