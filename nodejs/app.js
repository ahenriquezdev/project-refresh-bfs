const express = require('express');
const app = express();
const Mock = require('mockjs');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

// connection to mongodb
const url = 'mongodb://root:pass123@mongodb:27017/';
const dbName = 'project-db'

// listening port for node
const serverPort = 3000;

app.use(express.json());

// Retrieve all documents in collection
app.get('/api/get/all', async (req, res) => {
  try {

    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const collection = db.collection('users');
    const docs = await collection.find({}).toArray();

    res.status(200).json({ status: 'success', data: docs });
    client.close();
  } catch (err) {
    res.status(500).json({ status: 'error', data: "Error retrieving users" });
  }
});

// Querying users by name
app.get('/api/get', async (req, res) => {

  try {

    const name = req.query.name; // Retrieve name from query parameters

    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const collection = db.collection('users');

    // Regex pattern to perform a case-insensitive search
    const nameRegex = new RegExp(name, 'i');
    const query = {
      $or: [
        { first_name: nameRegex },
        { last_name: nameRegex }
      ]
    };

    const docs = await collection.find(query).toArray();

    res.status(200).json({ status: 'success', data: docs });
    client.close();
  } catch (err) {
    res.status(500).json({ status: 'error', data: "Error retrieving user" });
  }
});

// Create or Update an user
// Only first_name, last_name and email are required to test
app.put('/api/update/:id', async (req, res) => {
  try {
    const userId = req.params.id; // Extract user id from the URL parameter

    // Check if the provided user id is valid
    if (!mongodb.ObjectId.isValid(userId)) {
      return res.status(400).json({ status: 'error', data: "Invalid user id" });
    }

    // Extract the fields to be updated from the request body
    const { first_name, last_name, email } = req.body;

    // Check if at least one non-empty field to update is provided
    if (!(first_name || last_name || email)) {
      return res.status(400).json({ status: 'error', data: "No valid fields to update are provided" });
    }

    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const collection = db.collection('users');

    // Check if the document exists in the database
    const existingDoc = await collection.findOne({ _id: new mongodb.ObjectId(userId) });

    if (!existingDoc) {
      // If not found, create a new document with the provided fields
      const document = {
        _id: new mongodb.ObjectId(userId),
        first_name,
        last_name,
        email,
        gender: Mock.Random.pick(['Male', 'Female']),
        address: {
          city: Mock.Random.city(),
          state: Mock.Random.province(),
          country: Mock.mock('@county(true)'),
          country_code: Mock.Random.county(true)
        },
        card: {
          card_number: Mock.Random.integer({ min: 1000000000000000, max: 9999999999999999 }).toString(),
          card_type: Mock.Random.pick(['Visa', 'MasterCard', 'American Express']),
          currency_code: Mock.Random.character('ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
          balance: Mock.Random.float({ min: 0, max: 10000, precision: 2 })
        },
        married_status: Mock.Random.boolean()
      };

      const result = await collection.insertOne(document);
      return res.status(201).json({ status: 'success', data: "User created" });
    }

    // If found, update the document with the provided fields
    const updateFields = {};
    if (first_name) updateFields.first_name = first_name;
    if (last_name) updateFields.last_name = last_name;
    if (email) updateFields.email = email;

    const updateResult = await collection.updateOne(
      { _id: new mongodb.ObjectId(userId) },
      { $set: updateFields }
    );

    res.status(200).json({ status: 'success', data: "User updated" });
    client.close();
  } catch (err) {
    console.log(err)
    res.status(500).json({ status: 'error', data: "Error updating user" });
  }
});

// Delete a user by id
app.delete('/api/delete/:id', async (req, res) => {

  try {

    const userId = req.params.id; // Extract user id from the URL parameter

    // Check if the provided user id is valid
    if (!mongodb.ObjectId.isValid(userId)) {
      return res.status(400).json({ status: 'error', data: "Invalid user id" });
    }

    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const collection = db.collection('users');
    const result = await collection.deleteOne({ _id: new mongodb.ObjectId(userId) });

    if (result.deletedCount === 0) {
      return res.status(204).json({ status: 'success', data: "User was not found!" }); // If not found, do nothing (204 No Content)
    }

    res.status(200).json({ status: 'success', data: "User deleted!" });  // If found, document deleted (200 OK)
    client.close();
  } catch (err) {
    res.status(500).json({ status: 'error', data: "Error deleting user" });
  }
});

// basic test
app.listen(serverPort, () => {
  console.log(`Our bootcamp server is listening on port ${serverPort}`);
});

app.use('/', (req, res) => {
  res.status(200).json({ status: 'success', data: "Welcome to our node/mongo app!" });  // If found, document deleted (200 OK)
});

// catch all 404 request handler
app.use((req, res) => {
  res.status(404).json({ status: 'error', data: "Looks like this path leads to a dead end!" });
});

