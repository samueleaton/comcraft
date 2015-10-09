'use strict';
const path = require('path');
const fs = require('fs');

let Event;

const packageJson = {
	name: null,
	version: '0.0.1',
	description: '',
	main: null,
	scripts: {},
	author: '',
	license: '',
	dependencies: {
		minimist: ''
	}
};

function NodeCraft(args, EventEmitter, libDir) {
	Event = EventEmitter;
	createPackageJson(args, libDir);
	// console.log('args:', args);
}

function createPackageJson(args, libDir) {
	const pathToJson = path.join(libDir, args.commandName, 'package.json');

	packageJson.name = args.commandName;
	packageJson.main = args.commandName;
	packageJson.author = process.env.USER;

	const jsonOutput = JSON.stringify(packageJson, null, 2) + '\n';

	fs.writeFile(pathToJson, jsonOutput, function (err) {
		if (err) return Event.emit('internalError', err);
		Event.emit('comCreated', args);
	});

}

module.exports = NodeCraft;
