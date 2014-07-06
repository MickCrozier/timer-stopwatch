var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
	
function Stopwatch(countDownTime, options) {

	this.flagclock = 0;
	this.flagstop = 0;
	this.stoptime = 0;
	this.clock = "";
	this.refreshTimer = 0;
	this.done = false;
	this.almostDoneFired = false;
	this.doneFired = false;

	this.countDownTime = (countDownTime * 1000) || false;


	//// options
	if(!options) {options = {};}
	this.refreshTime = options.refreshTime || 10;
	this.almostDoneTime = (options.almostDoneTime * 1000) || 10000;
	
	//// init
	this.reset(countDownTime);
}


Stopwatch.prototype = {
	
	start: function() {
		this.startstop('start');
	},

	stop: function() {
		this.startstop('stop');
	},

	reset: function(countDownTime) {
		
		this.flagstop = 0;
		this.flagclock = 0; //forces clock to stop on reset
		this.stoptime = 0;
		this.done = false;
		clearTimeout(this.refreshTimer);
		
		if(this.countDownTime) {
			this.clock = this.formattime(this.countDownTime,'');
		} else {
			this.clock = this.formattime(0,''); // reset to 0	
		}
		
		///// not needed as we force the clock to stop on reset
		if(this.flagclock === 1)
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
				this.flagclock = 0;
			} else if(force === 'stop') {
				this.flagclock = 1;
			}
		}
	
		var startdate = new Date();
		var starttime = startdate.getTime();
		if(this.flagclock === 0)
			{
			this.flagclock = 1;
			this.counter(starttime);
			}
		else
			{
			this.flagclock = 0;
			this.flagstop = 1;
			this.splitdate = '';
			}
			
		return this.flagclock;
	},
		


	counter: function(starttime) {
		
		var currenttime = new Date();
		var timediff = currenttime.getTime() - starttime;
		if(this.flagstop === 1) {
			timediff = timediff + this.stoptime;
		}
		if(this.flagclock === 1) {
			var time;
		
			if(this.countDownTime) { // run clock backwards declaring done when reached 0 
				time = this.countDownTime - timediff; 
				if(time < 0) {
					time = 0; 
					this.flagclock = 0; // stop the clock
					this.done = true;
					if(!this.doneFired) {
						this.emit('done');
						this.doneFired = true;
					}
					
				} else if (time < this.almostDoneTime) {
					if(!this.almostDoneFired) {
						this.emit('almostdone');
						this.almostDoneFired = true;
					}
				}
				time = time + 999; ///999 micro seconds added for display so stops as soon as it displays 0
				
			} else { // run clock forwards with no auto stop
				
				time = timediff; 
				
			}

			var prevClock = this.clock;
			this.clock = this.formattime(time,''); 
			if(this.clock !== prevClock) {
				this.emit('time',{clock:this.clock, ms: time});
			}
			var my = this;
			this.refreshTimer = setTimeout(function(){my.counter(starttime);},10);

		} else {
			clearTimeout(this.refreshTimer);
			this.stoptime = timediff;
		}
	},
		
	formattime: function(rawtime) {
		var ds = Math.round(rawtime/100) + '';
		var sec = Math.floor(rawtime/1000);
		var min = Math.floor(rawtime/60000);
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

