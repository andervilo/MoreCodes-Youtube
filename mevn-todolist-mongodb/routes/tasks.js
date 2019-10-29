var express = require("express");
var router = express.Router();
const ObjectId = require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://dbuser:suelaine0512.@cluster0-j3kxl.mongodb.net/crud-example";

// const uri = "mongodb+srv://dbuser:suelaine0512.@cluster0-j3kxl.mongodb.net/crud-example";
// var db = mongojs(
//   "meantask",
//   ["tasks"]
// );

MongoClient.connect(uri, (err, client) => {
  if (err) return console.log(err)
  db = client.db('crud-example') 
})

router.get("/tasks",function(req, res) {
  db.collection('tasks').find().toArray((err, results) => {
    if (err) return console.log(err)
    console.log(results)
    res.json(results)
  })
})

router.post("/tasks", (req,res)=>{
  db.collection('tasks').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('Salvo no Banco de Dados')
    res.json(result)
  })
})

router.delete("/tasks/:id", function(req, res, next) { 
  console.log(req.params.id);
  
  db.collection('tasks').deleteOne({_id: ObjectId(req.params.id)}, (err, result) => {
    if (err) return res.send(500, err)
    console.log('Deletado do Banco de Dados!')
    res.json(result)
  })
});

// Update Task
router.put("/tasks/:id", function(req, res, next) {
  var task = req.body;
  var updTask = {};

  if (task.title) {
    updTask.title = task.title;
  }

  if (!updTask) {
    res.status(400);
    res.json({
      error: "Bad Data"
    });
  } else {
    db.collection('tasks').updateOne({_id: ObjectId(req.params.id)}, {
      $set: {
        title: updTask.title
      }
    }, (err, result) => {
      if (err) return res.send(err)
      res.json(result)
    })
  }
});

module.exports = router;
