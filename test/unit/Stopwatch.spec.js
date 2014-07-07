
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
	});


	it('should set the clock to the countdown time', function() {
		var countdownTimer = new Stopwatch(60000);
		expect(countdownTimer.clock).to.be('01:00');
	});

	it('should countdown with a normal refresh rate', function(done) {
		var countdownTimer = new Stopwatch(60000);
		var startTime = countdownTimer.ms;
		countdownTimer.start();
		setTimeout(function(){
			expect(countdownTimer.ms).to.be.equal(startTime);
		}, 2);

		setTimeout(function(){
			countdownTimer.stop();
			expect(countdownTimer.ms).to.be.below(startTime);
			done();
		}, 15);
	});

	it('should countdown at max refresh speed', function(done) {
		var countdownTimer = new Stopwatch(60000, {refreshRateMS:1});
		var startTime = countdownTimer.ms;
		countdownTimer.start();
		setTimeout(function(){
			countdownTimer.stop();
			expect(countdownTimer.ms).to.be.below(startTime);
			done();
		}, 2);
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
		countdownTimer.start();
		countdownTimer.on('time',function(time){
			countdownTimer.stop();
			expect(countdownTimer.ms).to.be.below(startTime);
			expect(time.ms).to.equal(countdownTimer.ms);
			done();
		});
	});

	it('should fire the almostdone event', function(done) {
		var countdownTimer = new Stopwatch(40, {almostDoneMS:20});
		var startTime = countdownTimer.ms;
		countdownTimer.start();
		countdownTimer.on('almostdone',function(formatted, ms){
			countdownTimer.stop();
			expect(countdownTimer.ms).to.below(20);
			expect(countdownTimer.ms).to.above(15);
			done();
		});
	});

	it('should fire the done event', function(done) {
		var countdownTimer = new Stopwatch(30, {almostDoneMS:1});
		var startTime = countdownTimer.ms;
		countdownTimer.start();
		countdownTimer.on('done',function(){
			countdownTimer.stop();
			expect(countdownTimer.ms).to.equal(0);
			done();
		});
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
		var stopwatch = new Stopwatch();
		var startTime = stopwatch.ms;
		stopwatch.start();
		setTimeout(function(){
			expect(stopwatch.ms).to.be.equal(startTime);
		}, 4);

		setTimeout(function(){
			stopwatch.stop();
			expect(stopwatch.ms).to.be.above(startTime);
			done();
		}, 15);
	});

	it('should countdown at max refresh speed', function(done) {
		var stopwatch = new Stopwatch(false, {refreshRateMS:1});
		var startTime = stopwatch.ms;
		stopwatch.start();
		setTimeout(function(){
			stopwatch.stop();
			expect(stopwatch.ms).to.be.above(startTime);
			done();
		}, 2);
	});


	it('should countdown, pause, then continue', function(done) {
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


	it('should fire the time event', function(done) {
		var stopwatch = new Stopwatch();
		var startTime = stopwatch.ms;
		stopwatch.start();
		stopwatch.on('time',function(time){
			stopwatch.stop();
			expect(stopwatch.ms).to.be.above(startTime);
			expect(time.ms).to.equal(stopwatch.ms);
			done();
		});
	});

	it('should NOT fire the almostdone event', function(done) {
		var stopwatch = new Stopwatch(false, {almostDoneMS:50});
		stopwatch.start();
		var fired = false;
		stopwatch.on('almostdone',function(formatted, ms){
			fired = true;
		});
		setTimeout(function() {
			expect(fired).to.be(false);
			done();
		}, 30);
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
		}, 20);
	});

});

