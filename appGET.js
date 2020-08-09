exports.getAllWorkouts = (req, res) => {
    collection.find({}).toArray((err, result) => {
      if (err) {
        res.status(404).send('We have faiced some issues');
      } else {
        res.status(200).send(result)
      }
    });
};
  
exports.getWorkout = (req, res) => {
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
};
  
exports.getExercise = (req, res) => {
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
};

