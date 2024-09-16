require('dotenv').config() // load environment variables from a .env file

const express = require('express') // import the express framework
const { connectToMongoDB } = require('./database') // import the MongoDB connection function from the database module
const path = require('path') // import path module to handle file paths

const app = express() // create an express application instance
app.use(express.json()) // middleware to parse JSON requests

// serve static files from the 'build' directory, typically for serving a frontend (like a React app)
app.use(express.static(path.join(__dirname, 'build')))

// route for the root URL ("/") to serve the index.html file from the 'build' directory
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'))
})

const router = require('./routes') // import routes from the "routes" module
app.use('/api', router) // prefix all routes from the "routes" module with "/api"

const port = process.env.PORT || 4000 // set the port to the value in the environment variable or default to 4000

// function to start the server
async function startServer() {
  await connectToMongoDB() // connect to MongoDB before starting the server
  app.listen(port, () => {
    // start the express server
    console.log(`Server is listening on http://localhost:${port}`) // log the server URL
  })
}

startServer() // call the function to start the server
