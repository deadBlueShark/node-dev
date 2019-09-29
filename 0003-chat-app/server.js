const express = require('express');
let app = express();

// Set up HTTP server to work with Socket.io
let http = require('http').Server(app);
let io = require('socket.io')(http);


let bodyParser = require('body-parser'); // Use to parse request body to JSON

// app.listen(3000);
http.listen(3000);

// Setting middleware
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

let messages = [
  { name: 'David', content: 'Hi'},
  { name : 'James', content: 'Nice to meet you' }
]

app.get('/messages', (req, res) => {
  res.send(messages);
})

app.post('/messages', (req, res) => {
  console.log(req.body);
  messages.push(req.body);
  res.sendStatus(200);
})

