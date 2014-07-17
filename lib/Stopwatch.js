// Developed by Mick Crozier
// MIT License

// Based on work from Kore Byberg - http://www.timpelen.com/extra/sidebars/stopwatch/stopwatch.htm


var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
	


function Stopwatch(countDownMS, options) {

	this.runTimer = false;	// Whether the clock should run or not
	this.stoptime = 0;  	// the time the clock has been paused at
		
	this.refreshTimer = 0;	// timeout interval for counter
	this.done = false;		// true if comleted
	this.almostDoneFired = false;	// true if almostDone event has been fired (prevent mlti hits)
	this.doneFired = false;		// true if done event has been fired (prevent multi hits)

	this.countDownMS = (countDownMS) || false; // Time to reset the clock too (false = count up stopwatch)
	this.ms = this.countDownMS || 0; // number of milliseconds on the timer
	

	//// options
	if(!options) {options = {};}
	this.refreshRateMS = options.refreshRateMS || 50;
	this.almostDoneMS = options.almostDoneMS || 10000;
	
	//// init
	this.reset(countDownMS);
}


Stopwatch.prototype = {
	
	start: function() {
		this.startstop('start');
	},

	stop: function() {
		this.startstop('stop');
	},

	reset: function(countDownMS) {
		this.stop();
		clearTimeout(this.refreshTimer);

		this.doneFired = false;
		this.almostDoneFired = false;
		this.stoptime = 0;
		this.done = false;
		
		if(countDownMS) {
			this.countDownMS = countDownMS;
		}
		this.ms = this.countDownMS || 0;
	},



	startstop: function(force) {
		if(force) {
			if(force === 'start') {
				this.runTimer = false;
			} else if(force === 'stop') {
				this.runTimer = true;
			}
		}

		var starttime = new Date().getTime();
		if(!this.runTimer) {
			this.runTimer = true;
			this.counter(starttime);
		} else {
			this.runTimer = false;
		}
		return this.runTimer;
	},
		


	counter: function(starttime) {
		
		var timediff = new Date().getTime() - starttime + this.stoptime;

		if(this.runTimer) {
			var time;
			if(this.countDownMS) { // run clock backwards declaring done when reached 0 
				time = this.countDownMS - timediff; 
				
				if(time < 0) {time = 0;}
				this.ms = time;


				if(time === 0) {
					this.stop(); // stop the clock
					
					if(!this.doneFired) {
						this.doneFired = true;
						this.done = true;
						this.emit('done');
					}
					
				} else if (time < this.almostDoneMS) {
					if(!this.almostDoneFired) {
						this.almostDoneFired = true;
						this.emit('almostdone');
					}
				}
				
			} else { // run clock forwards
				time = timediff; 
				this.ms = time;
			}

			this.emit('time',{ms: this.ms});
			var that = this;

			this.refreshTimer = setTimeout(function(){that.counter(starttime);},this.refreshRateMS);

		} else {
			clearTimeout(this.refreshTimer);
			this.stoptime = timediff;
		}
	},
};


_.extend(Stopwatch.prototype, EventEmitter.prototype);


module.exports = Stopwatch;

