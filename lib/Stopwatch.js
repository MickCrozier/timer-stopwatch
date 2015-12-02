// Developed for TKD-Score-Server by Mick Crozier 2015
// MIT License



var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');



function Stopwatch(countDownMS, options) {

	STATUS = {
		STOPPED: 0,
		RUNNING: 1,
		COMPLETE: 2,
	};

	this.stoptime = 0;  			// the time the clock has been paused at
	this.refTime = 0;				// reference time when started

	this.tickTimer = 0;				// interval timer for updateTime

	this.almostDoneFired = false;	// true if almostDone event has been fired (prevent mlti hits)
	this.doneFired = false;			// true if done event has been fired (prevent multi hits)

	this.countDownMS = countDownMS || false; 
	this.ms = this.countDownMS || 0;
	this._elapsedMS = 0;			// number if elapsed milliseconds		
	this.state = STATUS.STOPPED;	// current status of the timer-stopwatch


	//// options
	if(!options) {options = {};}
	this.refreshRateMS = options.refreshRateMS || 50;
	this.almostDoneMS = options.almostDoneMS || 10000;


	//// init
	this.reset(countDownMS);

	return this; // for chaining
}




Stopwatch.prototype = {

	/**
	 * Start the timer
	 */
	start: function() {
		if (this.tickTimer) {
            clearInterval(this.tickTimer);
        }
        this.state = STATUS.RUNNING;

        this.refTime = new Date().getTime();
        this.refTime -= this._elapsedMS;
        var self = this;
        this.tickTimer = setInterval(function(){self._updateTime();}, this.refreshRateMS);
        this._updateTime(this);
	},

	/**
	 * Stops the timer
	 *
	 * Emits the event forcestop,
	 * with one parameter passed to the callback,
	 * that consists of the elapsed time.
	 */
	stop: function() {
		if(this.tickTimer) {
            clearInterval(this.tickTimer);
        }
        if(this.state === STATUS.RUNNING) {
            this.state = STATUS.STOPPED; // prevents updatedTime being called in an infinite loop
            this._updateTime(this);
            this.emit('stop');
            this.emit('forcestop'); // for backwards compatability. Will be depreciated
        }
	},

	/**
	 * Stop a timer, and reset it to it's defaults.
	 * Change the countdown value, if a paramter is provided.
	 *
	 * @param {Integer} Milliseconds to set the timer to.
	 */
	reset: function(countDownMS) {
		this.stop();
		this.state = STATUS.STOPPED;
		this.doneFired = false;
		this.almostDoneFired = false;
		this._elapsedMS = 0;
		this.refTime = new Date().getTime();

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

	startstop: function() {
		if(this.state === STATUS.STOPPED) {
            this.start();
            return true;
        } else {
            this.stop();
            return false;
        }
	},


	/**
	 * Updates the time
	 * @private
	 */
	_updateTime: function() {
		var self = this;
        if(self.countDownMS > 0) {
        	self._timerCountdown(self);
        } else {
        	self._stopwatchCountup(self);
        }
	},

	/**
	 * Updates the time for timer
	 * @private
	 */
	_timerCountdown: function() {
		var self = this;
		var currentTime = new Date().getTime();
        //Find the difference between current time and start time.
        self._elapsedMS = currentTime - self.refTime;


        var remainingSeconds = self.countDownMS - self._elapsedMS;
        if(remainingSeconds < 0) {
        	remainingSeconds = 0;
        }

        self.ms = remainingSeconds;
        self.emit('time', {ms: self.ms});
        
        if(remainingSeconds <= 0) {
            self.stop(); // stop the clock
            if(!self.doneFired) {
                self.doneFired = true;
                self.state = STATUS.COMPLETE;
                self.emit('done');
            }
        } else if (remainingSeconds < self.almostDoneMS) {
            if(!self.almostDoneFired) {
                self.almostDoneFired = true;
                self.emit('almostdone');
            }
        }

	},

	/**
	 * Updates the time for stopwatch
	 * @private
	 */
	_stopwatchCountup: function() {
		var self = this;
		var currentTime = new Date().getTime();

		self._elapsedMS = currentTime - self.refTime;
        self.ms = self._elapsedMS;
        self.emit('time', {ms: self.ms});
	},

	/**
	 * Adds a callback to be fired on the done event
	 * @returns {Object} itself for chaining
	 */
	onDone: function(cb) {
		this.on('done', cb);
		return this;
	},

	/**
	 * Adds a callback to be fired on the almostdone event
	 * @returns {Object} itself for chaining
	 */
	onAlmostDone: function(cb) {
		this.on('almostDone', cb);
		return this;
	},

	/**
	 * Adds a callback to be fired on the time event
	 * @returns {Object} itself for chaining
	 */
	onTime: function(cb) {
		this.on('time', cb);
		return this;
	},

	/**
	 * Adds a callback to be fired on the stop event
	 * @returns {Object} itself for chaining
	 */
	onStop: function(cb) {
		this.on('stop', cb);
		return this;
	},


};


_.extend(Stopwatch.prototype, EventEmitter.prototype);
module.exports = Stopwatch;

