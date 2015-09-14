module.exports = (function() {
	'use strict';


	function newFang() {
		// Fang Core Methods
		var _fang = {
			// Initiates Fang Series
			init: function () {
				var args = [];
				for(var i = 0, ii = arguments.length; i < ii; i++){
					args.push(arguments[i]);
				}
				// console.log("this",this)
				this.utils.i = -1;
				return this.next.apply(null, args);
			},

			// Initiates Async Fang Series
			// initAsync: function() {
			// 	var args = [];
			// 	var callback;
			// 	for(var i = 0, ii = arguments.length; i < ii; i++){
			// 		if (i < ii - 1) args.push(arguments[i]);
			// 		else {
			// 			if (typeof arguments[i] !== "function"){
			// 				callback = null;
			// 				console.warn("No callback given for fang.initAsync");
			// 			}
			// 		}
			// 	}

			// 	this.utils.queue.forEach(function(func){
			// 		if(typeof func === "function") func();
			// 	})
			// 	this.utils.i = -1;
			// 	return this.next.apply(null, args);
			// },

			// Adds Function to Fang Series
			then: function(_callback) {
				if (typeof _callback === 'function') _fang.utils.queue.push(_callback);
				return _fang;
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
					return _fang.utils.queue[_fang.utils.i].apply({ next: _fang.next }, args);
				}
			},

			push: function(callback){
				if(typeof callback === "function") this.then(callback);
				else console.error("passed a non-function to fang");
			},

			utils: {
				config: {
					async: false,
					maxParallel: 10,
					asyncComplete: null
				},
				// the queue that will hold all of the function in the series
				queue: [],

				// index starts at -1 so that the first item is index zero
				i: -1
			}
		}; // end _fang

		var newFangObject = Object.create(_fang);

		for(var i = 0, ii = arguments.length; i < ii; i++){
			if(typeof arguments[i] === "function") newFangObject.then(arguments[i]);
		}

		return newFangObject;

		// return {
		// 	next: function() {

		// 		newFangObject.next.apply(newFangObject, arguments);
		// 	},
		// 	init: function() {
		// 		newFangObject.init.apply(newFangObject, arguments);
		// 	},
		// 	// initAsync: function() {
		// 	// 	newFangObject.initAsync.apply(newFangObject, arguments);
		// 	// },
		// 	push: function() {
		// 		newFangObject.push.apply(newFangObject, arguments);
		// 	}
		// 	// ,
		// 	// config: function(object) {
		// 	// 	if(!object) return;
		// 	// 	newFangObject.utils.async = object.async || false;
		// 	// 	newFangObject.utils.maxParallel = object.maxParallel || 10;
		// 	// 	newFangObject.utils.maxParallel = object.asyncComplete || null;
		// 	// }
		// };
		// return newFangObject;
	}

	return newFang;
})();
