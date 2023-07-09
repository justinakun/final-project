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
    const { name, surname, email, age, password } = req.body;
    const con = await client.connect();

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

// sort questions based on query parameters
app.get('/questions', async (req, res) => {
  try {
    const { sort } = req.query;
    let sortField;
    let sortType;

    if (sort === 'dsc') {
      sortField = 'date';
      sortType = -1;
    } else if (sort === 'asc') {
      sortField = 'date';
      sortType = 1;
    } else if (sort === 'answered') {
      sortField = 'answerCount';
      sortType = -1;
    } else if (sort === 'unanswered') {
      sortField = 'answerCount';
      sortType = 1;
    } else {
      sortField = 'date';
      sortType = -1; // Default sorting by date in descending order (newest first)
    }

    const con = await client.connect();
    const data = await con
      .db(dbName)
      .collection('questions')
      .aggregate([
        {
          $lookup: {
            from: 'answers',
            localField: '_id',
            foreignField: 'questionId',
            as: 'answers',
          },
        },
        {
          $addFields: {
            answerCount: { $size: '$answers' },
          },
        },
        {
          $sort: {
            [sortField]: sortType,
          },
        },
      ])
      .toArray();

    await con.close();

    const questions = data.map((question) => {
      return {
        _id: question._id,
        question: question.question,
        date: question.date,
        answerCount: question.answerCount,
      };
    });

    if (sort === 'unanswered') {
      const unansweredQuestions = questions.filter(
        (question) => question.answerCount === 0,
      );
      res.send(unansweredQuestions);
    } else if (sort === 'answered') {
      const answeredQuestions = questions.filter(
        (question) => question.answerCount !== 0,
      );
      res.send(answeredQuestions);
    } else {
      res.send(questions);
    }
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
    const likedBy = [];
    const dislikedBy = [];
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
        likedBy,
        dislikedBy,
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
    const date = new Date();

    const con = await client.connect();
    const answers = con.db(dbName).collection('answers');

    const result = await answers.updateOne(
      { _id: new ObjectId(id) },
      { $set: { answer, edited: true, date: date } },
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

// patch likes - trying
// patch likes
app.patch('/answers/:id/likes', async (req, res) => {
  try {
    const { id } = req.params;
    const { likedBy, dislikedBy } = req.body;
    console.log(likedBy);
    console.log(dislikedBy);

    const con = await client.connect();
    const answers = con.db(dbName).collection('answers');

    const result = await answers.updateOne(
      { _id: new ObjectId(id) },
      { $set: { likedBy, dislikedBy } },
    );

    await con.close();

    if (result.matchedCount === 1) {
      res.send({ message: 'Likes updated successfully' });
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

// get a particular answer
app.get('/answers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const con = await client.connect();
    const data = await con
      .db(dbName)
      .collection('answers')
      .findOne(new ObjectId(id));
    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.listen(port, () => {
  console.log(`Server is running on the ${port} port`);
});
