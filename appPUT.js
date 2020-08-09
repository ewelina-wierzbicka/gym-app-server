exports.addExercise = (req, res) => {
    collection.updateOne({ _id: req.params.id.toString(), "exercises.exerciseId": { $not: { $eq: req.body.exerciseId.toString() } } },
      { $push: { "exercises": { exerciseId: req.body.exerciseId.toString(), title: req.body.exercise, sets: [] } } }, (err, result) => {
        if (err) {
          res.status(500).send('Not saved to database')
        } else {
          res.status(201).send(result);
          console.log('Saved to database');
        }
    });
  };
  
  
  exports.addSet = (req, res) => {
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
  };