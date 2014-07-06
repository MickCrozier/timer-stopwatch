
##IN DEVLEOPMENT - NOT READY YET

node-countdown-stopwatch
========================
[![Build Status](https://travis-ci.org/MickCrozier/node-countdown-stopwatch.svg?branch=master)](https://travis-ci.org/MickCrozier/node-countdown-stopwatch)

A stopwatch and countdown clock module for node.js


This is based on work from a browser stopwatch I found years ago - sadly I cannot find it again to give credit to original author.



Install
======

```shell
npm install git://github.com/mickcrozier/node-countdown-stopwatch.git
```


How to
======
```
timer = new Stopwatch([countDownTime], [options])
```


```js
var Stopwatch = require('node-countdown-stopwatch');
var timer = new Stopwatch(60); // A new countdown timer with 60 seconds
var clock = new Stopwatch(); // A new count up clock. Starts at 0.

// Fires every 10ms by default. Change setting the 'refreshTime' options
timer.on('time', function(time) {
	console.log(time.clock); // formatted time as mm:ss
	console.log(time.ms); // number of milliseconds past (or remaining);
});

// Fires when the timer is done
timer.on('done', function(){
	console.log('Timer is complete');
});

// Fires when the timer is almost complete - default is 10 seconds remaining. Chnage with 'almostDoneTime' option
timer.on('almostdone', function() {
	console.log('Timer is almost complete');
});

```


Testing
======

Unit and Integration tests (requires dev dependencies)
```shell
grunt test
```

#### Options
**--watch** watches for changed files and re-runs tests automatically


License
======
MIT License
Copyright 2014 Mick Crozier

