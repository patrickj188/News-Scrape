const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(process.cwd() + '/public'));

const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// mongoose.connect('mongodb://heroku_dcl884np:heroku_dcl884np@ds221155.mlab.com:21155/heroku_dcl884np', { useMongoClient: true });

 mongoose.connect('mongodb://localhost/scraped_news', { useMongoClient: true });



const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
});

const routes = require('./controller/controller.js');
app.use('/', routes);

const port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('Listening on PORT ' + port);
});
