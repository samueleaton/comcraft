module.exports = function() {
	// Fang Object
	var _fang = {

		/* Initiates Fang Series
		*/
		init: function () {
			var args = [];
			for(var i = 0, ii = arguments.length; i < ii; i++){
				args.push(arguments[i]);
			}
			// sets first function of series as the next
			_fang.utils.i = -1;

			// run next function
			return _fang.next.apply(null, args);
		},

		/* Runs the Next Function in the Series
		*/
		next: function() {
			var args = [];
			for(var i = 0, ii = arguments.length; i < ii ; i++) {
				args.push(arguments[i]);
			}

			// if the next function has been defined
			if (typeof _fang.utils.queue[_fang.utils.i + 1] !== 'undefined') {
				// add the next function to the 
				args.unshift(_fang.next);
				// increment the current call index
				_fang.utils.i++;
				// run the next function
				return _fang.utils.queue[_fang.utils.i].apply({next: _fang.next}, args);
			}

			// if there are no more function, next will re-init fang group
			return _fang.init.apply(null, args);
		},

		utils: {
			// the queue that will hold all of the function in the series
			queue: [],

			// index starts at -1 so that the first item is index zero
			i: -1
		}
	};

	// var newFangObject = Object.create(_fang);
	for (var i = 0, ii = arguments.length; i < ii; i++) {
		if (typeof arguments[i] === "function") _fang.utils.queue.push(arguments[i]);
		// if(typeof arguments[i] === "function") newFangObject.then(arguments[i]);
	}

	return _fang.init.bind(_fang);
}
