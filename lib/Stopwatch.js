// Developed for TKD-Score-Server by Mick Crozier 2014
// MIT License

// Based on work from Kore Byberg - http://www.timpelen.com/extra/sidebars/stopwatch/stopwatch.htm


var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
	


function Stopwatch(countDownMS, options) {

	this.flagclock = false;	// Whether the clock should run or not
	this.flagstop = false;	// signifies the clock should stop	
	this.stoptime = 0;  	// the time the clock has been paused at
	this.clock = "";		// a formated time
		
	this.refreshTimer = 0;	// How long between timer updates
	this.done = false;		// true if comleted
	this.almostDoneFired = false;	// true if almostDone event has been fired (prevent mlti hits)
	this.doneFired = false;		// true if done event has been fired (prevent multi hits)

	this.countDownMS = (countDownMS) || false;
	

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

	reset: function() {
		
		this.flagstop = false;
		this.flagclock = false; //forces clock to stop on reset
		this.stoptime = 0;
		this.done = false;
		clearTimeout(this.refreshTimer);

		this.ms = this.countDownMS || 0;
		if(this.countDownMS) {
			this.clock = this.formattime(this.countDownMS,'');
		} else {
			this.clock = this.formattime(0,''); // reset to 0	
		}
		
		///// not needed as we force the clock to stop on reset
		if(this.flagclock)
		{
			var resetdate = new Date();
			var resettime = resetdate.getTime();
			this.counter(resettime);
		}
		
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

			var prevClock = this.clock;
			this.clock = this.formattime(time,'');
			

			//if(this.clock !== prevClock) {
			this.emit('time',{clock:this.clock, ms: time});
			//}
			var my = this;
			this.refreshTimer = setTimeout(function(){my.counter(starttime);},this.refreshRateMS);

		} else {
			clearTimeout(this.refreshTimer);
			this.stoptime = timediff;
		}
	},
		
	formattime: function(rawtime) {
		var adjustedTime = rawtime;

		// when counting down need to add time on the display so that timers will appear to stop SMACK ON 00:00
		// his will be silly if displaying ms. also needs adjustment if displaying only minutes
		if(this.countDownMS) { 
			adjustedTime = rawtime + 999; 
		}

		var ds = Math.round(adjustedTime/100) + '';
		var sec = Math.floor(adjustedTime/1000);
		var min = Math.floor(adjustedTime/60000);
		ds = ds.charAt(ds.length - 1);

		if(min >= 60) {
			startstop();
		}
		sec = sec - 60 * min + '';

		if(sec.charAt(sec.length - 2) !== '') {
			sec = sec.charAt(sec.length - 2) + sec.charAt(sec.length - 1);
		} else {
			sec = 0 + sec.charAt(sec.length - 1);
		}	
		min = min + '';

		if(min.charAt(min.length - 2) !== '')
		{
			min = min.charAt(min.length - 2)+min.charAt(min.length - 1);
		} else {
			min = 0 + min.charAt(min.length - 1);
		}
		//return min + ':' + sec + ':' + ds;
		return min + ':' + sec;
	},
};


_.extend(Stopwatch.prototype, EventEmitter.prototype);


module.exports = Stopwatch;

