const express = require('express');
const dotenv = require('dotenv');
dotenv.config()
const cookieParser = require('cookie-parser')
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./models/database');

// routers
const userRouter = require('./routes/register.route');

// instantiate express
const app = express();
// configure bodyparser
app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json())

app.use(cors());
app.use(cookieParser(''));
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));
 

const port = process.env.PORT || 3006;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
  
    next();
})

// app router
app.use('/api/v1/', userRouter);

// home page display current bitcoin price
app.get("/btc", function(req, res) {
  res.send("Blockchain.info Price: " + btcPrice)
});

app.listen(port,() => {
    console.log(`app is running on ${port}`)
});

app.use(express.static(path.join(__dirname, 'client/build')));
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

if (process.env.NODE_ENV === 'production') {

  app.get('/', (req, res) => {
    res.status(200).json(({
        status: 'success',
        message: 'welcome to the flashtoken api'
    }))
  })
  // Exprees will serve up production assets
  app.use(express.static('client/build'));

  // Express serve up index.html file if it doesn't recognize route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// export app for test
module.exports = app;