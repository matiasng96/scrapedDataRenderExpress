const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const leagueteam = require('./models/leagueteam');
const MONGODB_URI = require('./config/database');
//Mongoose conection
mongoose
	.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log('Conectado!');
	})
	.catch((err) => {
		console.log('Error!');
		console.log(err);
	});

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));
app.engine('handlebars', exphbs({defaultLayout : 'main'}));
app.set('view engine', 'handlebars');

app.set('port', (process.env.PORT || 3000));


app.get('/', function(req, res){
	res.render('home')
   
});

app.get('/anual', (req, res) => {
	leagueteam.findOne((err, teams) => {

	  if (err) {console.log("Error!", err)};

	  const clubs = teams.team;

	  res.render('tablaAnual', {teams : clubs});
	});
  });

app.listen(app.get('port'), function(){
    console.log('Server started on port' + app.get('port'));
});

