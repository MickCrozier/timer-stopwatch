
timer-stopwatch [![Codeship Status for MickCrozier/timer-stopwatch](https://codeship.io/projects/d68910a0-e989-0131-eba0-368dc75eab9e/status)](https://codeship.io/projects/26196)
========================

A stopwatch and countdown clock module for node.js


Install
======

```shell
npm install timer-stopwatch
```


How to
======
**The Gist**
new Stopwatch([countDownMS], [options])


Basic timers
```js
var Stopwatch = require('timer-stopwatch');

var timer = new Stopwatch(60000); // A new countdown timer with 60 seconds
var stopwatch = new Stopwatch(); // A new count up stopwatch. Starts at 0.
```

###Events
```js
// Fires every 50ms by default. Change setting the 'refreshRateMS' options
timer.on('time', function(time) {
	console.log(time.ms); // number of milliseconds past (or remaining);
});

// Fires when the timer is done
timer.on('done', function(){
	console.log('Timer is complete');
});

// Fires when the timer is almost complete - default is 10 seconds remaining. Change with 'almostDoneMS' option
timer.on('almostdone', function() {
	console.log('Timer is almost complete');
});

```

###Methods
```js
timer.start();
timer.stop();
timer.startstop(); // toggle the state of the timer. (If started, stop it. If stopped, start it.)
timer.reset(countDownMS); // optional countDownMS to reset countdown to that many milliseconds
```

###Properties
```js
timer.ms;		// Number of milliseconds on the clock
```



###Options
```js
var options = {
	refreshRateMS: 10,		// How often the clock should be updated
	almostDoneMS: 10000, 	// When counting down - this event will fire with this many milliseconds remaining on the clock
}

var timer = new Stopwatch(60000, options);
```



Testing
======

Unit and Integration tests (requires dev dependencies)
```shell
npm test
```

License
======
MIT License

