'use strict';

const menu = `
----------------------------------
 Options
----------------------------------

-v, --version          ... print comcraft version
-h, --help             ... print help screen
-l , ls                ... list created commands

----------------------------------
 Instructions
----------------------------------

  Creating a New Command
  ----------------------
  craft create mycommand


  Specifing Target Environment
  ----------------------------
  craft create mycommand --env=ruby

  Available target languages are node, ruby, and bash.
  The default is node.


  Removing a Command
  ------------------
  craft remove mycommand

  Removes command from .lib and .bin folders in your home directory.


  List Your Creations
  -------------------
  craft ls
  See a list of the commands created with comcraft.
	`;

module.exports = function () {
	console.log(menu);
};
