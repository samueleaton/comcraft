#!/usr/bin/env node

'use strict';

var path = require('path');
var fs = require('fs-extra');
// const exec = require('child_process').exec;
var argv = require('minimist')(process.argv.slice(2));
var fang = require('fangs');
var EventEmitter = require('events').EventEmitter;
var Event = new EventEmitter();

var binDir = path.normalize(path.join(process.env.HOME, '/.bin'));
var libDir = path.normalize(path.join(process.env.HOME, '/.lib'));

var HelpMenu = require('../scripts/helpMenu');

var reservedCommands = ['rm', 'cd', 'craft', 'comcraft', 'sudo', '$'];

var comcraftCommands = ['create', 'remove', 'list', 'help'];

var compatibleEnvironments = ['node', 'ruby'];

var newCommandMap = {
	node: 'console.log("$$");\nconsole.log("##")',
	ruby: 'puts "$$"\nputs "##"'
};

/* Internal Error
*/
Event.on('internalError', function (err) {
	console.log('Internal Error: \n', err);
});

/* User Error
*/
Event.on('userError', function (err) {
	console.log('\nHouston, we have a problem!');
	console.log(err);
	console.log('\nTry \'craft help\' for help.\n');
	throw new Error('Something bad happened!');
});

/* CREATE THE COMMAND
*/
var createCommand = fang(

/* create '$HOME/.bin' directory if it doesn't exist
*/
function (args) {
	var _this = this;

	/*eslint-disable  no-invalid-this*/
	fs.mkdirp(path.normalize(binDir), function (err) {
		if (err) Event.emit('internalError', err);
		_this.next(args);
	});
},

/* create '$HOME/.lib' and '$HOME/.lib/command_name' directories if they don't exist
*/
function (args) {
	var _this2 = this;

	fs.mkdirp(path.normalize(libDir + '/' + args.commandName), function (err) {
		if (err) Event.emit('internalError', err);
		_this2.next(args);
	});
},

/* check if an executable already exists at '$HOME/.lib/command_name/command_name'
*/
function (args) {
	var _this3 = this;

	fs.readFile(args.execPath, 'utf-8', function (err) {
		if (!err) {
			console.log('\nHouston, We have a problem: \'' + args.execPath + '\' already exists.\n');
			console.log('If you want to remove the \'' + args.commandName + '\' command, try:\n');
			console.log('\t comcraft remove ' + args.commandName + '\n');
			throw new Error('Executable already exists');
		}
		_this3.next(args);
	});
},

/* create the executable file
*/
function (args) {
	var _this4 = this;

	var fileContents = '#!/usr/bin/env ' + args.env + '\n';
	fileContents += newCommandMap[args.env].replace('$$', 'This is your "' + args.commandName + '" command!').replace('##', 'Edit me at "' + args.execPath + '"');

	fileContents += '\n';

	fs.writeFile(args.execPath, fileContents, function (err) {
		if (err) Event.emit('internalError', err);
		_this4.next(args);
	});
},

/* set the file mode as 'executable'
*/
function (args) {
	var _this5 = this;

	fs.chmod(args.execPath, '755', function (err) {
		if (err) Event.emit('internalError', err);
		_this5.next(args);
	});
},

/* create a symlink from '$HOME/.bin' to '$HOME/.lib/command_name/command_name'
*/
function (args) {
	fs.symlink(args.execPath, binDir + '/' + args.commandName, function (err) {
		if (err) Event.emit('internalError', err);
		Event.emit('comCreated', args);
	});
}
/*eslint-disable  no-invalid-this*/
);

/* REMOVE A COMMAND
*/
var removeCommand = fang(function (args) {
	var _this6 = this;

	fs.remove(binDir + '/' + args.commandName, function (err) {
		if (err) return Event.emit('userError', err);
		_this6.next(args);
	});
}, function (args) {
	fs.remove(libDir + '/' + args.commandName, function (err) {
		if (err) return Event.emit('userError', err);
		Event.emit('comRemoved', args);
	});
});

/* On Comcraft Init
*/
Event.on('init', function (args) {
	if (!args) return Event.emit('internalError');
	// console.log('\nargs', args);
	parseArgs(args);
});

/* On User Arguments Parsed
*/
Event.on('argsParsed', function (args) {
	if (!args) return Event.emit('internalError');

	if (args.commandName) {
		args.execPath = path.normalize(libDir + '/' + args.commandName + '/' + args.commandName);
	}

	if (args.action === 'create') {
		createCommand.init(args);
	} else if (args.action === 'remove') {
		removeCommand.init(args);
	} else if (args.action === 'help') {
		helpMenu();
	} else if (args.action === 'list') {
		listCommands();
	} else if (args.action === 'info') {
		showInfo();
	}
});

/* On Command Created
*/
Event.on('comCreated', function (args) {
	console.log('\nWe have liftoff! 🚀 ');
	console.log('The file at "' + libDir + '/' + args.commandName + '/' + args.commandName + '" will run on the "' + args.commandName + '" command. So go ahead and edit it.\n');
});

Event.on('comRemoved', function (args) {
	console.log('Successfully removed the ' + args.commandName + ' command.');
});

/* HELP MENU
*/
function helpMenu() {
	HelpMenu();
}

/* INFO
*/
function showInfo() {
	console.log('show info screen');
}

/* LIST CREATED COMMANDS
*/
function listCommands() {
	fs.readdir(binDir, function (err, files) {
		if (err) return Event.emit('internalError', err);
		console.log('Commands in ' + binDir + ': ');
		files.filter(function (f) {
			return f.charAt(0) !== '.';
		}).forEach(function (f) {
			return console.log(f);
		});
	});
}

/* PARSE/VERIFY USER ARGUMENTS
*/
function parseArgs(args) {

	/*SHOW HELP MENU*/
	if (args.h || args.help || argv._[0] === 'help') {
		args.action = 'help';
		return Event.emit('argsParsed', args);
	}

	/*LIST CREATED COMMANDS*/
	if (args.l || args.list || argv._[0] === 'ls' || argv._[0] === 'list') {
		args.action = 'list';
		return Event.emit('argsParsed', args);
	}

	/*SHOW INFO ABOUT COMCRAFT*/
	if (args.i || args.info || argv._[0] === 'info') {
		args.action = 'info';
		return Event.emit('argsParsed', args);
	}

	/*USER ERROR CHECKING*/
	if (argv._.length < 1) {
		Event.emit('userError', 'Must give comcraft a command.');
	}

	if (args._.length === 1 && args._[0] === 'remove') {
		return Event.emit('userError', 'Specify command to remove.');
	}

	if (args._.length === 1) {
		if (reservedCommands.indexOf(args._[0]) !== -1) {
			return Event.emit('userError', '\'' + args._[0] + '\' is a reserved command name.');
		}
		if (args._[0] === 'create') {
			return Event.emit('userError', 'Specify a command name to create.');
		}
	}

	if (args._.length === 2) {
		if (args._[0] === 'create' && reservedCommands.indexOf(args._[0]) !== -1) {
			return Event.emit('userError', '\'' + args._[0] + '\' is a reserved command name.');
		}
		if (comcraftCommands.indexOf(args._[0]) === -1) {
			return Event.emit('userError', 'Unkown command: ' + args._[0]);
		}
	}

	if (args._.length > 2) {
		return Event.emit('userError', 'Too many commands given.');
	}

	/*CHECK TARGET ENVIRONMENT*/
	if (args.env) {
		if (compatibleEnvironments.indexOf(args.env.toLowerCase()) === -1) {
			return Event.emit('userError', 'Unkown Target Environment: ' + args.env);
		}
		args.env = args.env;
	} else {
		args.env = 'node';
	}

	/*CREATE COMMAND*/
	if (args._.length === 1) {
		args.action = 'create';
		args.commandName = args._[0];
		return Event.emit('argsParsed', args);
	}

	if (args._.length === 2) {

		/*CREATE COMMAND*/
		if (args._[0] === 'create') {
			args.action = 'create';
			args.commandName = args._[1];
			return Event.emit('argsParsed', args);
		}

		/*REMOVE COMMAND*/
		if (args._[0] === 'remove') {
			args.action = 'remove';
			args.commandName = args._[1];
			return Event.emit('argsParsed', args);
		}
	}

	return Event.emit('userError', 'Unkown Commands.');
}

Event.emit('init', argv);

