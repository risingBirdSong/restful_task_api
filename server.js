
const express = require("express");
const app = express();

app.use(express.static(__dirname + "/static"));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.urlencoded({extended: true}));


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/task_db', {useNewUrlParser: true});

const TaskSchema = new mongoose.Schema({
  title : String,
  description : String,
  complete : Boolean,
  created_at : Date, 
  updated_at : Date
})


const Task = mongoose.model("Task", TaskSchema);

// require('./server/config/routes.js')(app);

app.get('/', (req,res)=>{
  res.render('index');
})

app.get('/tasks', (req, res) =>{
  Task.find()
  .then((allTasks)=>{
    res.json(allTasks);
  })
})

app.get('/tasks/:id', (req, res)=>{
  Task.find({_id : req.params.id})
  .then((grabbed)=>{
    res.json(grabbed);
  })
})

app.post('/tasks', (req, res) => {
  console.log(req.body)
  let newTask = new Task();
  newTask.title = req.body.title;
  Task.create(req.body)
  .then(()=>{
    console.log('yeah!')
    res.redirect('/tasks');
  })
})

app.get('/deleteall', (req, res)=>{
  Task.deleteMany({})
  .then(()=>{
    res.redirect('/tasks')
  })
})

app.post('/tasks/:id', (req, res)=>{
  Task.update({_id : req.params.id}, {
    title : req.body.title,
    description : req.body.description,
    complete : req.body.complete
  })
  .then(()=>{
    res.redirect(`/tasks/${req.params.id}`);
  })
})

app.get('/delete/:id', (req, res)=>{
  Task.deleteOne({_id : req.params.id})
  .then(()=>{
    res.redirect('/tasks');
  })
})

app.listen(8000, ()=>{
  console.log('listening on the port 8000');
})
