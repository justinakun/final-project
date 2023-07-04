const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

require('dotenv').config();

const port = process.env.PORT || 8080;
const URI = process.env.DB_CONNECTION_STRING;
const dbName = process.env.DB_NAME;

const app = express();
app.use(express.json()); // aplikacija moka apdoroti JSON formatu ateinancius requestus
app.use(cors());

const client = new MongoClient(URI);

// get all users
app.get('/', async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con.db(dbName).collection('users').find().toArray();
    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

// POST /register - add a new user to the database
app.post('/register', async (req, res) => {
  try {
    const { name, surname, username, email, age, password } = req.body;
    const con = await client.connect();

    // check if the username already exists
    const existingUser = await con
      .db(dbName)
      .collection('users')
      .findOne({ username: username });
    if (existingUser) {
      await con.close();
      return res.status(400).json({ error: 'Username already exists' });
    }

    const data = await con.db(dbName).collection('users').insertOne({
      name,
      surname,
      username,
      email,
      age,
      password,
    });
    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

// POST //login
app.post('/login', async (req, res) => {
  try {
    // check if the user exists
    const con = await client.connect();
    const user = await con
      .db(dbName)
      .collection('users')
      .findOne({ username: req.body.username });
    if (user) {
      // check if password matches
      const result = req.body.password === user.password;

      // NOT SURE IF THIS CON.CLOSE IS IN THE RIGHT PLACE
      await con.close();
      if (result) {
        // I may need to change the following behaviour
        res.send('Login successful');
      } else {
        res.status(400).json({ error: "Password doesn't match the username" });
      }
    } else {
      res.status(400).json({ error: "User doesn't exist" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

// GET/questions
app.get('/questions', async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con.db(dbName).collection('questions').find().toArray();
    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

// POST/questions
app.post('/questions', async (req, res) => {
  try {
    // not sure if the userId part is correct
    const { question } = req.body;
    const date = new Date();
    const id = 1;
    const con = await client.connect();
    const data = await con
      .db(dbName)
      .collection('questions')
      .insertOne({ question, date, userId: new ObjectId(req.body.userId), id });
    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

// PATCH/questions/:id - same as put
app.put('/questions/:id', async (req, res) => {
  try {
    const id = +req.params.id;
    const con = await client.connect();
    const questions = con.db(dbName).collection('questions');
    const findIndex = await questions.findIndex(
      (question) => question.id === id,
    );
    if (findIndex !== -1) {
      const newQuestion = req.body;
      const updatedQuestion = { id, ...newQuestion };
      // Since questions is a MongoDB collection, you cannot use splice directly
      // Instead, you should use the updateOne method to update the document
      await questions.updateOne({ id: id }, { $set: updatedQuestion });
      res.send(updatedQuestion);
    } else {
      res
        .status(404)
        .send({ message: 'The question with this ID does not exist' });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on the ${port} port`);
});
