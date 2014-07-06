
/////////////////////////////////////////////////////
var expect = require('expect.js');			/////////
/////////////////////////////////////////////////////




describe('Countdown Timer', function() {
	
	var Stopwatch = null;

	beforeEach(function() {
		Stopwatch = require('../../lib/Stopwatch.js');
	});
	
	afterEach(function() {
		
	});


	it('should be able to create a countdown watch with 60 seconds', function() {
		var countdownTimer = new Stopwatch(60);
		expect(countdownTimer.countDownTime).to.be(60 * 1000);
	});


	it('should set the clock to the countdown time', function() {
		var countdownTimer = new Stopwatch(60);
		countdownTimer.reset();
		expect(countdownTimer.clock).to.be('01:00');
	});


});