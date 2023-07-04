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

// get all questions
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

// post a new question
app.post('/questions', async (req, res) => {
  try {
    // not sure if the userId part is correct
    const { question } = req.body;
    const date = new Date();
    const edited = false;
    const con = await client.connect();
    const data = await con
      .db(dbName)
      .collection('questions')
      .insertOne({
        question,
        date,
        edited,
        userId: new ObjectId(req.body.userId),
      });
    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

// // get a particular question
// app.get('/questions/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const con = await client.connect();
//     const data = await con
//       .db(dbName)
//       .collection('questions')
//       .findOne(new ObjectId(id));
//     await con.close();
//     res.send(data);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// edit a particular question
app.patch('/questions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { question } = req.body;

    const con = await client.connect();
    const questions = con.db(dbName).collection('questions');

    const result = await questions.updateOne(
      { _id: new ObjectId(id) },
      { $set: { question, edited: true } },
    );

    await con.close();

    if (result.matchedCount === 1) {
      res.send({ message: 'Question updated successfully' });
    } else {
      res.status(404).send({ message: 'Question not found' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Internal server error', error });
  }
});

// delete a particular question:
app.delete('/questions/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const con = await client.connect();
    const questions = con.db(dbName).collection('questions');

    const result = await questions.deleteOne({ _id: new ObjectId(id) });

    await con.close();

    if (result.deletedCount === 1) {
      res.send({ message: 'Question deleted successfully' });
    } else {
      res.status(404).send({ message: 'Question not found' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Internal server error', error });
  }
});

// get a question and answers to it ??
app.get('/questions/:id/answers', async (req, res) => {
  try {
    const { id } = req.params;

    const con = await client.connect();
    const db = con.db(dbName);
    const aggregationPipeline = [
      {
        $match: { _id: new ObjectId(id) },
      },
      {
        $lookup: {
          from: 'answers',
          localField: '_id',
          foreignField: 'questionId',
          as: 'answers',
        },
      },
    ];

    const result = await db
      .collection('questions')
      .aggregate(aggregationPipeline)
      .toArray();

    await con.close();

    if (result.length > 0) {
      res.send(result[0]);
    } else {
      res.status(404).send({ message: 'Question not found' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Internal server error', error });
  }
});

// post answers
app.post('/questions/:id/answers', async (req, res) => {
  try {
    const { id } = req.params;
    const { newAnswer, idUser } = req.body;
    const currentDate = new Date();
    const edited = false;
    const con = await client.connect();
    const data = await con
      .db(dbName)
      .collection('answers')
      .insertOne({
        answer: newAnswer,
        date: currentDate,
        edited,
        questionId: new ObjectId(id),
        userId: new ObjectId(idUser),
      });
    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

// patch answers
app.patch('/answers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;

    const con = await client.connect();
    const answers = con.db(dbName).collection('answers');

    const result = await answers.updateOne(
      { _id: new ObjectId(id) },
      { $set: { answer, edited: true } },
    );

    await con.close();

    if (result.matchedCount === 1) {
      res.send({ message: 'Answer updated successfully' });
    } else {
      res.status(404).send({ message: 'Answer not found' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Internal server error', error });
  }
});

// delete answers
app.delete('/answers/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const con = await client.connect();
    const answers = con.db(dbName).collection('answers');

    const result = await answers.deleteOne({ _id: new ObjectId(id) });

    await con.close();

    if (result.deletedCount === 1) {
      res.send({ message: 'Answer deleted successfully' });
    } else {
      res.status(404).send({ message: 'Answer not found' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Internal server error', error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on the ${port} port`);
});
