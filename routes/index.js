var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const multer  = require("multer");
const fs = require("fs");
const Record = require('../public/javascripts/record.js');
/* GET home page. */
const nameSite='СПП1';
const app = express();
var urlencodedParser = bodyParser.urlencoded({extended: false});



router.get('/', function(req, res, next) {
  var content = fs.readFileSync("data.json", "utf8");
  var taskList = JSON.parse(content);
  res.render('index', { title: nameSite, tasks: taskList });
});

app.use(express.static('public'));
app.use(multer({dest:"music"}).single("filedata"));


app.post("/upload", function (req, res, next) {

  let filedata = req.file;
  console.log(filedata);
  if(!filedata)
    res.send("Ошибка при загрузке файла");
  else
    res.send("Файл загружен");
});


router.post('/sortTask', urlencodedParser, function(req, res, next)
{
  if(!req.body) return res.sendStatus(400);
  var content = fs.readFileSync("data.json", "utf8");
  var taskList = JSON.parse(content);

  function sortGroup(a, b) {
    if (a.group > b.group) return 1;
    if (a.group < b.group) return -1;
    return 0;
  }

  taskList.sort(sortGroup);
  res.render('index', { title: nameSite, tasks: taskList });
});

router.post('/addTask', urlencodedParser, function(req, res, next) {
  if(!req.body) return res.sendStatus(400);
  var content = fs.readFileSync("data.json", "utf8");
  var taskList = JSON.parse(content);
  var noteId;
  if (req.body.songname != "" || req.body.group != ""){
    if (taskList[0] == null){
      noteId = 1;
    } else {
      var noteId = Math.max.apply(Math, taskList.map(function(o){return o.id;}));
      noteId++;
    }
  
     task = new Record(noteId, req.body.songname, req.body.group);
  
    taskList.push(task);
  
    content = JSON.stringify(taskList);
  
    fs.writeFileSync("data.json", content);
  }
  res.render('index', { title: nameSite, tasks: taskList });
});

router.post('/deleteTask/:id', urlencodedParser, function(req, res, next){
  if(!req.body) return res.sendStatus(400);
  var id = req.params["id"];
  var content = fs.readFileSync("data.json", "utf8");
  var taskList = JSON.parse(content);
  var index = -1;

  for (var i = 0; i < taskList.length; i++){
    if (taskList[i].id == id){
      index = i;
      break;
    }
  }

  if (index > -1){
    taskList.splice(index, 1);
    content = JSON.stringify(taskList);
    fs.writeFileSync("data.json", content);

    res.render('index', { title: nameSite, tasks: taskList });
  }
  else{
    res.status(404).send();
  }
});

router.post('/editTask/:id', urlencodedParser, function(req, res, next){
  if(!req.body) return res.sendStatus(400);
  var content = fs.readFileSync("data.json", "utf8");
  var taskList = JSON.parse(content);
  var editId = req.params["id"];
  var id = req.params["id"];
  res.render('edit', { title: nameSite, tasks: taskList, number:editId });
  var index = -1;

  for (var i = 0; i < taskList.length; i++){
    if (taskList[i].id == id){
      index = i;
      break;
    }
  }

  if (index > -1){
    taskList.splice(index, 1);
    content = JSON.stringify(taskList);
    fs.writeFileSync("data.json", content);

    res.render('index', { title: nameSite, tasks: taskList });
  }
  else{
    res.status(404).send();
  }
});



module.exports = router;
