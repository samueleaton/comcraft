# Comcraft
🚀 Craft your own terminal commands.

### How to Install
With npm:
```
npm install -g comcraft
```
And then add this to the bottom of your `.bash_profile` or `.bashrc`:
```
export PATH=$HOME/.bin:$PATH
```

<br>

### Creating a New Command
```
craft create mycommand
```
the `create` keyword is optional:
```
craft mycommand
```
Blast off! Comcraft should have created a `.lib` directory in your home directory. Find the new command and start editing. You're all set!

#### Specify a Target Language/Environment
```
craft create mycommand --env=ruby
```
Available target languages are `node`, `ruby`, `python`, `bash`, and `php`.  The default is `node`.
If your language isn't here, just make quick tweak to your command file after you create it.

<br>

### Removing a Command
```
craft remove mycommand
```
That's it. Comcraft should have removed your command from the a `.lib` and `.bin` folders in your home directory. 

<br>

### List Your Creations
See a list of the commands created with comcraft.
```
craft ls
```
Can also do `craft list` or `craft -l`

<hr>

### About Comcraft
Comcraft is a tool for you to make and organize your own terminal commands. It creates two folders in your home directory called `.bin` and `.lib`. All new commands are stored in the `.lib` folder and are pointed to by a symlink in the `.bin` directtory.

