module.exports = {
	colorXpos: function(pos) {
		if (pos <= 4) {
			return 'top4';
		}
		if (pos >= 13) {
			return 'last4';
		}

		return 'halftable';
	}
};
