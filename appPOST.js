exports.createWorkout = (req, res) => {
  collection.insertOne({ _id: req.body.id.toString(), date: new Date(), exercises: [] }, (err, result) => {
      if (err) {
        res.status(500).send('Not saved to database')
      } else {
        res.status(201).send(result);
        console.log('Saved to database');
      }
    });
};