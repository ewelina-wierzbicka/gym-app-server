const express = require('express')
const bodyParser = require('body-parser');
var cors = require('cors')
const app = express();

require('dotenv/config');

const MongoClient = require('mongodb').MongoClient;

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());


app.get('/workout', (req, res) => {
  collection.find({}).toArray((err, result) => {
    if (err) {
      res.status(404).send('We have faiced some issues');
    } else {
      res.status(200).send(result)
    }
  });
});

app.get('/workout/:id', (req, res) => {
  collection.aggregate([
    { $match: { _id: req.params.id.toString() } },
    { $project: {
      _id: 0,
      exercises: 1
    } },
    { $unwind: "$exercises" },
    { $project: {
      title: "$exercises.title",
      sets: "$exercises.sets"
    } }
  ])
  .toArray((err, result) => {
    if (err) {
      res.status(404).send('We have faiced some issues');
    } else {
      res.status(200).send(result)
    }
  });
});

app.get('/workout/:id/exercises/:exerciseId', (req, res) => {
  collection.aggregate([
    { $match: { _id: req.params.id.toString() } },
    { $project: {
        _id: 0,
        exercise: {
          $filter: {
            input: "$exercises",
            as: "exercise",
            cond: { $eq: [ "$$exercise.exerciseId", req.params.exerciseId.toString() ] }
          } 
        }
    } },
    { $unwind: "$exercise"},
    { $project: {
        sets: "$exercise.sets"
    } }
   ])
   .toArray((err, result) => {
    if (err) {
      res.status(500).send('Ups, we have an error');
    } else {
      res.status(200).send(result);
    }
   });    
 });


app.get('/workout/exercises/:exerciseId', (req, res) => {
  collection.aggregate([
    { $sort: { date: -1 } },
    { $limit: 2 },
    { $skip: 1 },
    { $project: {
        _id: 0,
        date: 1,
        exercise: {
          $filter: {
            input: "$exercises",
            as: "exercise",
            cond: { $eq: [ "$$exercise.exerciseId", req.params.exerciseId.toString() ] }
          } 
        }
    } },
    { $unwind: "$exercise"},
    { $project: {
      date: 1,
      sets: "$exercise.sets",
    } }
   ])
   .toArray((err, result) => {
    if (err) {
      res.status(500).send('Ups, we have an error');
    } else {
      res.status(200).send(result);
    }
   });    
 });


app.post('/workout', (req, res) => {
  collection.insertOne({ _id: req.body.id.toString(), date: new Date(), exercises: [] }, (err, result) => {
    if (err) {
      res.status(500).send('Not saved to database')
    } else {
      res.status(201).send(result);
      console.log('Saved to database');
    }
  });
});


app.put('/workout/:id', (req, res) => {
  collection.updateOne({ _id: req.params.id.toString(), "exercises.exerciseId": { $not: { $eq: req.body.exerciseId.toString() } } },
    { $push: { "exercises": { exerciseId: req.body.exerciseId.toString(), title: req.body.exercise, sets: [] } } }, (err, result) => {
      if (err) {
        res.status(500).send('Not saved to database')
      } else {
        res.status(201).send(result);
        console.log('Saved to database');
      }
  });
});


app.put('/workout/:id/exercises/:exerciseId', (req, res) => {
  if(!req.body.weight) return res.status(400).send("Weight is required");
  if(!req.body.rep) return res.status(400).send("Rep is required");
  collection.updateOne({ _id: req.params.id.toString(), "exercises.exerciseId": req.params.exerciseId.toString() },
    { $push: { "exercises.$.sets": { weight: req.body.weight, rep: req.body.rep } } }, (err, result) => {
      if (err) {
        res.status(500).send('Not saved to database')
      } else {
        res.status(201).send(result);
        console.log('Saved to database');
      }
  });
});


const client = new MongoClient(process.env.DB_CONNECTION, { useNewUrlParser: true }, { useUnifiedTopology: true });
client.connect(() => {
  collection = client.db("gym-app").collection("workout-list");
});

app.listen(port, () => console.log(`listening on port ${port}!`));