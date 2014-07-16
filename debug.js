
var Stopwatch = require('./lib/Stopwatch');


var countdownTimer = new Stopwatch(200, {almostDoneMS:600, refreshRateMS:100});
var startTime = countdownTimer.ms;

var doneFiredTimes = 0;
var hasBeenReset = false;

setTimeout(function() {
	console.log(doneFiredTimes);
}, 4000);

countdownTimer.start();

countdownTimer.on('done',function(){
	console.log('GOT DONE HIT');
	doneFiredTimes++;
	setTimeout(function(){
		countdownTimer.reset();
		countdownTimer.start();
	}, 300);
	
});
