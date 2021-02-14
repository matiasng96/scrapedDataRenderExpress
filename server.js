////////////////////////////////////////////////
//Requires
////////////////////////////////////////////////
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const request = require('request-promise');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const model = require('./models/teamStats');
//const db = process.env.MONGODB_URI;
const db = 'mongodb+srv://matiasng:GnXBcKvAIobg2Zv9@cluster0.4i9ha.mongodb.net/test?retryWrites=true&w=majority';
const helpers = require('./helpers/helpers');
////////////////////////////////////////////////
////////////////////////////////////////////////

////////////////////////////////////////////////
//Mongoose conection
////////////////////////////////////////////////
mongoose
	.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
	.then(() => {
		console.log('Conectado!');
	})
	.catch((err) => {
		console.log('Error!');
		console.log(err);
	});
////////////////////////////////////////////////
////////////////////////////////////////////////

////////////////////////////////////////////////
//Express config
////////////////////////////////////////////////
const app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));
////////////////////////////////////////////////
////////////////////////////////////////////////

////////////////////////////////////////////////
//Handlebars config
////////////////////////////////////////////////
const hbs = exphbs.create({
	defaultLayout: 'main',
	layoutsDir: path.join(app.get('views'), 'layouts'),
	partialsDir: path.join(app.get('views'), 'partials'),
	extname: '.hbs',
	helpers: helpers
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
////////////////////////////////////////////////
////////////////////////////////////////////////

async function scraperTablaCampeonato() {
	const result = await request.get('https://defensorsporting.com.uy/tabla/tabla-anual/'); //Se guarda el de la página html en la variable result, mediante el await logramos sincronía de la petición.

	const $ = cheerio.load(result); //Retorna un objeto que puede usarse con una estructura similar a jQuery.

	const scrapedData = []; // Inicializo el arreglo para guardar los datos scrapeados.

	const nombresClub = [
		'Nacional',
		'Montevideo City Torque',
		'Peñarol',
		'Rentistas',
		'Liverpool',
		'Wanderers',
		'Cerro Largo',
		'Defensor Sporting',
		'Deportivo Maldonado',
		'Fénix',
		'River Plate',
		'Boston River',
		'Progreso',
		'Plaza Colonia',
		'Danubio',
		'Cerro'
	];

	//For each: recorro cada elemento identificado con los selectores indicados.
	$('.sp-table-wrapper tbody tr').each((index, element) => {
		const tds = $(element).find('td'); // Guardo los tds de cada tr - element - .

		/*Almaceno en variables el contenido de cada td, 
		para encontrarlos utilizo el index correspondiente.*/

		const pos = $(tds[0]).text(); // Posición del Club.
		const abr = $(tds[1]).text(); // Abreviación del Nombre del Club.
		const escudo = $(tds[1]).find('img').attr('src'); // Imagen del Escudo del Club.
		const nombreClub = nombresClub[index]; // Nombre del Club.
		const j = $(tds[2]).text(); // Partidos Jugados.
		const g = $(tds[3]).text(); // Partidos Ganados.
		const e = $(tds[4]).text(); // Partidos Empatados.
		const p = $(tds[5]).text(); // Partidos Perdidos.
		const dg = $(tds[6]).text(); // Diferencia de Gol.
		const pts = $(tds[7]).text(); // Puntos totales.

		const tableRow = { pos, abr, escudo, nombreClub, j, g, e, p, dg, pts }; //Creo un objeto para cada fila con sus datos correspondientes.

		scrapedData.push(tableRow); // Inserto cada una de las filas en el arreglo inicializado anteriormente - scrappedData - .
	});

	//Instancia del Model con la data scrapeada y la fecha
	const teamData = new model.TeamStats({ team: scrapedData, date: new Date() });

	//El upsert true permite al findOneAndUpdate hacer Save o Update según la existencia del documento
	const options = { upsert: true };

	model.TeamStats.findOneAndUpdate({}, teamData, options, function(err) {
		if (err) {
			console.log(err, 'No se encontraron nuevos datos');
		} else {
			console.log('Nuevos datos almacenados/actualizados');
		}
	});
}
setInterval(scraperTablaCampeonato,1200000);


////////////////////////////////////////////////
//Requests
////////////////////////////////////////////////
app.get('/', function(req, res) {
	res.render('home');
});

app.get('/anual', function(req, res) {
	model.TeamStats.findOne(function(err, teamDoc) {
		if (err) {
			console.log('Error!', err);
		}

		res.render('tablaAnual', { stats: teamDoc.team });
	}).lean();
});

app.listen(app.get('port'), function() {
	console.log('Server started on port' + app.get('port'));
});
////////////////////////////////////////////////
////////////////////////////////////////////////
