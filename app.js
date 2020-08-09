const { getAllWorkouts, getWorkout, getExercise } = require('./appGET.js');
const { createWorkout } = require('./appPOST.js');
const { addExercise, addSet } = require('./appPUT.js');

const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();

require('dotenv/config');

const MongoClient = require('mongodb').MongoClient;

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());


app.get('/workout', getAllWorkouts);
app.get('/workout/:id', getWorkout);
app.get('/workout/:id/exercises/:exerciseId', getExercise);
app.post('/workout', createWorkout);
app.put('/workout/:id', addExercise);
app.put('/workout/:id/exercises/:exerciseId', addSet);

const client = new MongoClient(process.env.DB_CONNECTION, { useNewUrlParser: true }, { useUnifiedTopology: true });
client.connect(() => {
  collection = client.db("gym-app").collection("workout-list");
});

app.listen(port, () => console.log(`listening on port ${port}!`));