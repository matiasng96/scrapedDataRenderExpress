//Carpeta de modelado donde se guardan los Schemas de Mongoose.
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema De Estadísticas de Equipo
const TeamStatsSchema = new Schema({
	_id: String,
	date: Date,
	team: [
		{
			pos: Number,
			abr: String,
			escudo: String,
			nombreClub: String,
			j: Number,
			g: Number,
			e: Number,
			p: Number,
			dg: Number,
			pts: Number
		}
	]
});

const TeamStats = mongoose.model('LeagueTeams', TeamStatsSchema);



// Model basado en el teamStatsSchema.
module.exports = {TeamStats : TeamStats, Schema: TeamStatsSchema};