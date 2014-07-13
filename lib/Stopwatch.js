// Developed for TKD-Score-Server by Mick Crozier 2014
// MIT License

// Based on work from Kore Byberg - http://www.timpelen.com/extra/sidebars/stopwatch/stopwatch.htm


var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
	


function Stopwatch(countDownMS, options) {

	this.flagclock = false;	// Whether the clock should run or not
	this.flagstop = false;	// signifies the clock should stop	
	this.stoptime = 0;  	// the time the clock has been paused at
		
	this.refreshTimer = 0;	// How long between timer updates
	this.done = false;		// true if comleted
	this.almostDoneFired = false;	// true if almostDone event has been fired (prevent mlti hits)
	this.doneFired = false;		// true if done event has been fired (prevent multi hits)

	this.countDownMS = (countDownMS) || false;
	this.ms = this.countDownMS || 0;
	

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
		
		this.flagstop = false;
		this.flagclock = false; //forces clock to stop on reset
		this.stoptime = 0;
		this.done = false;
		clearTimeout(this.refreshTimer);
		if(countDownMS) {this.countDownMS = countDownMS;}

		this.ms = this.countDownMS || 0;
		

		
		this.doneFired = false;
		this.almostDoneFired = false;
	},


	startstop: function(force) {
		if(force) {
			if(force === 'start') {
				this.flagclock = false;
			} else if(force === 'stop') {
				this.flagclock = true;
			}
		}
	
		var startdate = new Date();
		var starttime = startdate.getTime();
		if(!this.flagclock) {
			this.flagclock = true;
			this.counter(starttime);
		} else {
			this.flagclock = false;
			this.flagstop = true;
		}
			
		return this.flagclock;
	},
		


	counter: function(starttime) {
		
		var currenttime = new Date();
		var timediff = currenttime.getTime() - starttime;

		if(this.flagstop) {
			timediff = timediff + this.stoptime;
		}

		if(this.flagclock) {
			var time;
		
			if(this.countDownMS) { // run clock backwards declaring done when reached 0 
				time = this.countDownMS - timediff; 
				
				if(time < 0) {time = 0;}
				this.ms = time;

				if(time === 0) {
					this.flagclock = false; // stop the clock
					this.done = true;
					if(!this.doneFired) {
						this.emit('done');
						this.doneFired = true;
					}
					
				} else if (time < this.almostDoneMS) {
					if(!this.almostDoneFired) {
						this.emit('almostdone');
						this.almostDoneFired = true;
					}
				}
				
				
				
			} else { // run clock forwards with no auto stop
				time = timediff; 
				this.ms = time;
			}


			this.emit('time',{ms: this.ms});
			var my = this;
			this.refreshTimer = setTimeout(function(){my.counter(starttime);},this.refreshRateMS);

		} else {
			clearTimeout(this.refreshTimer);
			this.stoptime = timediff;
		}
	},
		
	
};


_.extend(Stopwatch.prototype, EventEmitter.prototype);


module.exports = Stopwatch;

