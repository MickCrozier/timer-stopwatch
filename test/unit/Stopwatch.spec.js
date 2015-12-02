
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

	it('should be able to create a countdown watch with 30 seconds', function() {
		var countdownTimer = new Stopwatch(30000);
		expect(countdownTimer.countDownMS).to.be(30000);
		expect(countdownTimer.ms).to.be(30000);
	});

	it('should be able to change the countdown time during reset', function() {
		var countdownTimer = new Stopwatch(30000);
		expect(countdownTimer.countDownMS).to.be(30000);
		countdownTimer.reset(60000);
		expect(countdownTimer.countDownMS).to.be(60000);
		expect(countdownTimer.ms).to.be(60000);
	});


	it('should countdown with a normal refresh rate', function(done) {
		var countdownTimer = new Stopwatch(60000, {refreshRateMS:50});
		var startTime = countdownTimer.ms;
		countdownTimer.start();
		setTimeout(function(){
			expect(countdownTimer.ms).to.be.above(59998);
		}, 10);

		setTimeout(function(){
			countdownTimer.stop();
			expect(countdownTimer.ms).to.be.below(startTime);
			done();
		}, 70);
	});

	it('should countdown at max refresh speed', function(done) {
		var countdownTimer = new Stopwatch(60000, {refreshRateMS:1});
		var startTime = countdownTimer.ms;
		countdownTimer.start();
		setTimeout(function(){
			countdownTimer.stop();
			expect(countdownTimer.ms).to.be.below(startTime);
			done();
		}, 3);
	});


	it('should countdown, pause, then continue', function(done) {
		var countdownTimer = new Stopwatch(50, {refreshRateMS:1});
		var startTime = countdownTimer.ms;
		var splittime = 0;
		countdownTimer.start();
		setTimeout(function(){
			countdownTimer.stop();
			splittime = countdownTimer.ms;
			expect(splittime).to.be.below(startTime);
		}, 10);

		setTimeout(function(){
			expect(splittime).to.be(countdownTimer.ms);
			countdownTimer.start();
		}, 20);

		setTimeout(function(){
			countdownTimer.stop();
			expect(countdownTimer.ms).to.be.below(splittime);
			done();
		}, 30);
	});


	it('should fire the time event', function(done) {
		var countdownTimer = new Stopwatch(60000);
		var startTime = countdownTimer.ms;
		
		countdownTimer.on('time',function(time){
			expect(time.ms).to.equal(countdownTimer.ms);
			if(countdownTimer.state === 1) {
				done();
			}
			countdownTimer.stop();
		});
		countdownTimer.start();
	});

	it('should fire the almostdone event', function(done) {
		var countdownTimer = new Stopwatch(40, {almostDoneMS:20, refreshRateMS:10});
		var startTime = countdownTimer.ms;

		var onDone = function onDone(){
			countdownTimer.stop();
			expect(countdownTimer.ms).to.below(20);
			expect(countdownTimer.ms).to.above(5);
			countdownTimer.removeListener('almostdone', onDone);
			done();
		};

		countdownTimer.start();
		countdownTimer.on('almostdone', onDone);
	});

	it('should fire the done event', function(done) {
		var countdownTimer = new Stopwatch(30, {almostDoneMS:20});
		var startTime = countdownTimer.ms;

		var onDone = function onDone(){
			expect(countdownTimer.ms).to.equal(0);
			countdownTimer.removeListener('done', onDone);
			done();
		};

		countdownTimer.start();
		countdownTimer.on('done', onDone);
	});

	it('should fire the done event when done again after reset', function(done) {
		var countdownTimer = new Stopwatch(40, {almostDoneMS:20, refreshRateMS:10});
		var startTime = countdownTimer.ms;

		var doneFiredTimes = 0;

		setTimeout(function() {
			expect(doneFiredTimes).to.be(3);
			countdownTimer.removeListener('done', onDone);
			done();
		}, 350);

		var onDone = function onDone(){
			doneFiredTimes++;
			setTimeout(function(){
				expect(countdownTimer.ms).to.equal(0);
				expect(countdownTimer.doneFired).to.equal(true);
				countdownTimer.reset();
				expect(countdownTimer.ms).to.equal(40);
				countdownTimer.start();
				setTimeout(function(){
					expect(countdownTimer.doneFired).to.equal(false);
					expect(countdownTimer.ms).to.be.above(15);
					expect(countdownTimer.ms).to.be.below(31);
				}, 20);
			}, 100);	
		};

		countdownTimer.start();
		countdownTimer.on('done', onDone);
		
	});

	it('should fire the almostdDone event when ALMOST done again after reset', function(done) {
		var countdownTimer = new Stopwatch(40, {almostDoneMS:20, refreshRateMS:10});
		var startTime = countdownTimer.ms;

		var doneFiredTimes = 0;

		setTimeout(function() {
			expect(doneFiredTimes).to.be(3);
			countdownTimer.removeListener('almostdone', onDone);
			done();
		}, 350);


		var onDone = function onDone(){
			doneFiredTimes++;
			setTimeout(function(){
				countdownTimer.reset();
				countdownTimer.start();
			}, 100);
		};

		countdownTimer.start();

		countdownTimer.on('almostdone', onDone);
	});

	it('should fire the forcestop event', function(done) {
		var countdownTimer = new Stopwatch(50, {almostDoneMS:20});

		var onStop = function onStop(){
			expect(true).to.equal(true);
			countdownTimer.removeListener('stop', onStop);
			done();
		};

		countdownTimer.start();
		countdownTimer.on('stop', onStop);
		countdownTimer.stop();
	});
});

describe('Stopwatch', function() {
	
	var Stopwatch = null;

	beforeEach(function() {
		Stopwatch = require('../../lib/Stopwatch.js');
	});
	
	afterEach(function() {
		
	});

	it('should be able to create a stopwatch', function() {
		var countdownTimer = new Stopwatch();
		expect(countdownTimer.countDownMS).to.be(false);
	});


	it('should count up with a moderate refresh rate', function(done) {
		var stopwatch = new Stopwatch(false, {refreshRateMS:50});
		var startTime = stopwatch.ms;
		stopwatch.start();
		setTimeout(function(){
			expect(stopwatch.ms).to.be.equal(startTime);
		}, 30);

		setTimeout(function(){
			stopwatch.stop();
			expect(stopwatch.ms).to.be.above(startTime);
			done();
		}, 60);
	});

	it('should countup at max refresh speed', function(done) {
		var stopwatch = new Stopwatch(false, {refreshRateMS:1});
		var startTime = stopwatch.ms;
		stopwatch.start();
		setTimeout(function(){
			stopwatch.stop();
			expect(stopwatch.ms).to.be.above(startTime);
			done();
		}, 3);
	});


	it('should countup, pause, then continue', function(done) {
		var stopwatch = new Stopwatch(false, {refreshRateMS:1});
		var startTime = stopwatch.ms;
		var splittime = 0;
		stopwatch.start();
		setTimeout(function(){
			stopwatch.startstop();
			splittime = stopwatch.ms;
			expect(splittime).to.be.above(startTime);
		}, 10);

		setTimeout(function(){
			expect(splittime).to.be(stopwatch.ms);
			stopwatch.startstop();
		}, 20);

		setTimeout(function(){
			stopwatch.startstop();
			expect(stopwatch.ms).to.be.above(splittime);
			done();
		}, 30);
	});

	it('Should reset to 0', function(done) {
		var stopwatch = new Stopwatch(false, {refreshRateMS:1});

		stopwatch.startstop();

		setTimeout(function(){
			expect(stopwatch.ms).to.be.above(90);
			expect(stopwatch.ms).to.be.below(110);
			stopwatch.reset();
			expect(stopwatch.ms).to.be(0);
			setTimeout(function(){
				stopwatch.startstop();
				setTimeout(function(){
					expect(stopwatch.ms).to.be.above(90);
					expect(stopwatch.ms).to.be.below(110);
					stopwatch.reset();	
					expect(stopwatch.ms).to.be(0);
					done();
				}, 100);
			}, 100);
		}, 100);
	});


	it('should fire the time event', function(done) {
		var stopwatch = new Stopwatch();
		var startTime = stopwatch.ms;
		stopwatch.on('time',function(time){
			expect(time.ms).to.equal(stopwatch.ms);
			if(stopwatch.state === 1) {
				done();
			}
			stopwatch.stop();
		});
		stopwatch.start();
	});

	it('should NOT fire the almostdone event', function(done) {
		var stopwatch = new Stopwatch(false, {almostDoneMS:50, refreshRateMS:10});
		stopwatch.start();
		var fired = false;
		stopwatch.on('almostdone',function(formatted, ms){
			fired = true;
		});
		setTimeout(function() {
			expect(fired).to.be(false);
			done();
		}, 60);
	});


	it('should NOT fire the done event', function(done) {
		var stopwatch = new Stopwatch();
		stopwatch.start();
		var fired = false;
		stopwatch.on('done',function(formatted, ms){
			fired = true;
		});
		setTimeout(function() {
			expect(fired).to.be(false);
			done();
		}, 60);
	});

	it('should fire the stop event', function(done) {
		var stopwatch = new Stopwatch();

		var onStop = function onStop(){
			expect(true).to.equal(true);
			stopwatch.removeListener('stop', onStop);
			done();
		};

		stopwatch.start();
		stopwatch.on('stop', onStop);
		stopwatch.stop();
	});

});

