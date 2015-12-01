// Developed for TKD-Score-Server by Mick Crozier 2014
// MIT License

// Based on work from Kore Byberg - http://www.timpelen.com/extra/sidebars/stopwatch/stopwatch.htm


var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');



function Stopwatch(countDownMS, options) {

	this.runTimer = false;	// Whether the clock should run or not
	this.hasBeenStopped = false;	// signifies the clock should stop	
	this.stoptime = 0;  	// the time the clock has been paused at

	this.refreshTimer = 0;	// timeout interval for counter
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

	/**
	 * Start the timer
	 */
	start: function() {
		this.startstop('start');
	},

	/**
	 * Stops the timer
	 *
	 * Emits the event forcestop,
	 * with one parameter passed to the callback,
	 * that consists of the elapsed time.
	 */
	stop: function() {
		this.startstop('stop');
	},

	/**
	 * Stop a timer, and reset it to it's defaults.
	 * Change the countdown value, if a paramter is provided.
	 *
	 * @param {Integer} Milliseconds to set the timer to.
	 */

	reset: function(countDownMS) {

		this.stop();
		this.hasBeenStopped = false;
		this.doneFired = false;
		this.almostDoneFired = false;
		this.stoptime = 0;
		this.done = false;
		clearTimeout(this.refreshTimer);


		if(countDownMS) {
			this.countDownMS = countDownMS;
		}
		this.ms = this.countDownMS || 0;

		this.emit('time',{ms: this.ms});
	},

	/**
	 * Toggle the state of the timer.
	 * If one of start or stop is given as a argument to the
	 * function then the timer will be forced into that state.
	 *
	 * If no argument is given, then the timer's state will be toggled
	 * between start and stop.
	 * i.e. The timer will be stopped, if it is running, and the timer
	 * will be started if the timer is already stopped. 
	 *
	 * @param {String} start|stop Optional paramter.
	 * @returns {Boolean} true if the timer is running, false otherwise.
	 */

	startstop: function(force) {
		if(force) {
			if(force === 'start') {
				this.runTimer = false;
			} else if(force === 'stop') {
				this.runTimer = true;
			}
		}

		var startdate = new Date();
		var starttime = startdate.getTime();

		if(!this.runTimer) {

			this.runTimer = true;
			this.counter(starttime);
		} else {
			this.runTimer = false;
			this.hasBeenStopped = true;
			this.emit('forcestop', {elapsed: this.ms});
		}

		return this.runTimer;
	},


	/**
	 * The main function, consisting of the code that interfaces
	 * with the system time interface to find the elapsed time.
	 *
	 * Not intended to be used by end-users.
	 *
	 */
	counter: function(starttime) {

		var currenttime = new Date();
		var timediff = currenttime.getTime() - starttime;

		if(this.hasBeenStopped) {
			timediff = timediff + this.stoptime;
		}


		if(this.runTimer) {

			var time;
			var doneFlag = false;
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
						doneFlag = true;
					}

				} else if (time < this.almostDoneMS) {
					if(!this.almostDoneFired) {
						this.almostDoneFired = true;
						this.emit('almostdone');
					}
				}


			} else { // run clock forwards with no auto stop

				time = timediff; 
				this.ms = time;
			}


			this.emit('time',{ms: this.ms});
			var that = this;
			
			if (!doneFlag) {
				this.refreshTimer = setTimeout(function(){that.counter(starttime);},this.refreshRateMS);
			}
		} else {
			clearTimeout(this.refreshTimer);
			this.stoptime = timediff;
		}

	},


};


_.extend(Stopwatch.prototype, EventEmitter.prototype);


module.exports = Stopwatch;

