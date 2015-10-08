module.exports = function() {
	// Fang Core Methods
	var _fang = {
		// Initiates Fang Series
		init: function () {
			var args = [];
			for(var i = 0, ii = arguments.length; i < ii; i++){
				args.push(arguments[i]);
			}
			this.utils.i = -1;
			return this.next.apply(null, args);
		},

		// Runs the Next Function in the Series
		next: function() {
			// converts all incoming arguments into array
			var args = [];
			for(var i = 0, ii = arguments.length; i < ii ; i++) {
				args.push(arguments[i]);
			}
			// if a proceeding function has been defined (using the 'then' method)
			if (typeof _fang.utils.queue[_fang.utils.i + 1] !== 'undefined') {
				// increment the current call index
				_fang.utils.i++;
				// run the next function
				return _fang.utils.queue[_fang.utils.i].apply({next: _fang.next}, args);
			}
		},

		utils: {
			// the queue that will hold all of the function in the series
			queue: [],

			// index starts at -1 so that the first item is index zero
			i: -1
		}
	};

	// var newFangObject = Object.create(_fang);
	for(var i = 0, ii = arguments.length; i < ii; i++){
		if(typeof arguments[i] === "function") _fang.utils.queue.push(arguments[i]);
		// if(typeof arguments[i] === "function") newFangObject.then(arguments[i]);
	}

	return _fang.init.bind(_fang);
}
