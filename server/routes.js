const express = require('express') // import the express framework
const router = express.Router() // create an instance of express router
const { getConnectedClient } = require('./database') // import the function to get the connected MongoDB client
const { ObjectId } = require('mongodb') // import ObjectId for MongoDB document identification

// helper function to get the MongoDB collection
const getCollection = () => {
  const client = getConnectedClient() // get the MongoDB client
  const collection = client.db('todosdb').collection('todos') // select the 'todos' collection from 'todosdb' database
  return collection
}

// GET /todos/:userId - endpoint to fetch all todos for a specific user
router.get('/todos/:userId', async (req, res) => {
  const collection = getCollection() // get the MongoDB collection
  const { userId } = req.params // get userId from request parameters
  const todos = await collection.find({ userId }).toArray() // find all todos for the given userId
  res.status(200).json(todos) // respond with the todos in JSON format
})

// POST /todos/:userId - endpoint to create a new todo for a specific user
router.post('/todos/:userId', async (req, res) => {
  const collection = getCollection() // get the MongoDB collection
  let { todo } = req.body // get the todo item from request body
  const { userId } = req.params // get userId from request parameters

  if (!todo) {
    // check if todo is provided
    return res.status(400).json({ mssg: 'Error ! No Task found.' }) // respond with an error message if no todo is provided
  }

  todo = typeof todo === 'string' ? todo : JSON.stringify(todo) // ensure todo is a string
  const newTodo = await collection.insertOne({ userId, todo, status: false }) // insert the new todo into the collection
  res.status(201).json({ userId, todo, status: false, _id: newTodo.insertedId }) // respond with the created todo and its id
})

// DELETE /todos/:userId/:id - endpoint to delete a specific todo for a user
router.delete('/todos/:userId/:id', async (req, res) => {
  const collection = getCollection() // get the MongoDB collection
  const _id = new ObjectId(req.params.id) // convert the id parameter to an ObjectId
  const { userId } = req.params // get userId from request parameters

  const deletedTodo = await collection.deleteOne({ _id, userId }) // delete the todo with the specified id and userId
  res.status(200).json(deletedTodo) // respond with the result of the deletion
})

// PUT /todos/:userId/:id - endpoint to update the status of a specific todo
router.put('/todos/:userId/:id', async (req, res) => {
  const collection = getCollection() // get the MongoDB collection
  const _id = new ObjectId(req.params.id) // convert the id parameter to an ObjectId
  const { userId } = req.params // get userId from request parameters
  const { status } = req.body // get the new status from request body

  if (typeof status !== 'boolean') {
    // check if the provided status is a boolean
    return res.status(400).json({ mssg: 'Invalid Status.' }) // respond with an error message if status is not a boolean
  }

  const updatedTodo = await collection.updateOne(
    { _id, userId },
    { $set: { status: !status } }
  ) // toggle the status of the specified todo
  res.status(200).json(updatedTodo) // respond with the result of the update
})

module.exports = router // export the router to be used in the main application
