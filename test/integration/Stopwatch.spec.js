var expect = require('expect.js');

describe('Stopwatch operations', function() {
	var Stopwatch = require('../../index.js');
	beforeEach(function(){

	});

	it('should load up the stopwatch', function() {
		var countdownTimer = new Stopwatch(60);
		expect(countdownTimer).to.be.ok();
	});
});