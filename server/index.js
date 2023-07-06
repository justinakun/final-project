const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

require('dotenv').config();

const port = process.env.PORT || 8080;
const URI = process.env.DB_CONNECTION_STRING;
const dbName = process.env.DB_NAME;

const app = express();
app.use(express.json());
app.use(cors());

const client = new MongoClient(URI);

// get all users - USED
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

// POST /register - add a new user to the database - USED
app.post('/register', async (req, res) => {
  try {
    const { name, surname, username, email, age, password } = req.body;
    const con = await client.connect();

    // Check if the username already exists
    const existingUsername = await con
      .db(dbName)
      .collection('users')
      .findOne({ username: username });
    if (existingUsername) {
      await con.close();
      return res.send('Username already exists');
    }

    // Check if the email already exists
    const existingEmail = await con
      .db(dbName)
      .collection('users')
      .findOne({ email: email });
    if (existingEmail) {
      await con.close();
      return res.send('Email already exists');
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
    const { email, password } = req.body;
    const con = await client.connect();
    const data = await con
      .db(dbName)
      .collection('users')
      .findOne({ email: email });

    if (data) {
      if (password === data.password) {
        res.send(data);
      } else {
        res.send("Password doesn't match the email");
      }
    } else {
      res.send("User doesn't exist");
    }
  } catch (error) {
    res.status(400).send(error);
  } finally {
    await client.close();
  }
});

// get all questions
// app.get('/questions', async (req, res) => {
//   try {
//     const con = await client.connect();
//     const data = await con.db(dbName).collection('questions').find().toArray();
//     await con.close();
//     res.send(data);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// sorting questions
// /questions?sort=asc
// /questions?sort=dsc
app.get('/questions', async (req, res) => {
  try {
    const { sort } = req.query;
    const sortType = sort === 'asc' ? 1 : -1;

    const con = await client.connect();
    const data = await con
      .db(dbName)
      .collection('questions')
      .find()
      .sort({ date: sortType })
      .toArray();
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
    const { question, userId, name, surname } = req.body;
    const date = new Date();
    const edited = false;
    const con = await client.connect();
    const data = await con
      .db(dbName)
      .collection('questions')
      .insertOne({
        question,
        date,
        name,
        surname,
        edited,
        userId: new ObjectId(userId),
      });
    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

// get a particular question
app.get('/questions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const con = await client.connect();
    const data = await con
      .db(dbName)
      .collection('questions')
      .findOne(new ObjectId(id));
    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

// edit a particular question
app.patch('/questions/:id/', async (req, res) => {
  try {
    const { id } = req.params;
    const { question } = req.body;
    const date = new Date();

    const con = await client.connect();
    const questions = con.db(dbName).collection('questions');

    const result = await questions.updateOne(
      { _id: new ObjectId(id) },
      { $set: { question, edited: true, date: date } },
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

// delete a particular question with associated answers:
app.delete('/questions/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const con = await client.connect();
    const db = con.db(dbName);

    // Delete associated answers first
    await db.collection('answers').deleteMany({ questionId: new ObjectId(id) });

    // Delete the question
    const result = await db
      .collection('questions')
      .deleteOne({ _id: new ObjectId(id) });

    await con.close();

    if (result.deletedCount === 1) {
      res.send({
        message: 'Question and associated answers deleted successfully',
      });
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
    const { newAnswer, idUser, name, surname } = req.body;
    const currentDate = new Date();
    const edited = false;
    const con = await client.connect();
    const data = await con
      .db(dbName)
      .collection('answers')
      .insertOne({
        answer: newAnswer,
        name,
        surname,
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
