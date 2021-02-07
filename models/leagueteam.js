const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema
const teamStatsSchema = new Schema({
	team: [ Schema.Types.Mixed ]
});

// Model basado en el teamStatsSchema.
module.exports = mongoose.model('leagueteam', teamStatsSchema);

