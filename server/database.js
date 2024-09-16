require('dotenv').config() // load environment variables from a .env file

const { MongoClient, ServerApiVersion } = require('mongodb') // import MongoClient and ServerApiVersion from MongoDB

// get MongoDB URI from environment variables or default to a local MongoDB URI
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017'

// configuration options for MongoDB connection
const options = {
  serverApi: {
    version: ServerApiVersion.v1, // use Server API version v1
    strict: true, // enforce strict mode for MongoDB operations
    deprecationError: true, // throw errors for deprecated methods
  },
}

let client // variable to hold the MongoDB client instance

// function to connect to MongoDB asynchronously
const connectToMongoDB = async () => {
  if (!client) {
    // only attempt connection if there's no existing client instance
    try {
      client = await MongoClient.connect(uri, options) // connect to MongoDB using the URI and options
      console.log('Connected to MongoDB') // log success message when connected
    } catch (error) {
      console.log(error) // log any connection errors
    }
  }
  return client // return the connected client
}

// function to return the existing connected MongoDB client
const getConnectedClient = () => client

module.exports = { connectToMongoDB, getConnectedClient } // export functions for connecting and retrieving the MongoDB client
