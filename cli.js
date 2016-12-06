#!/usr/bin/env node
'use strict';


var program = require('commander'), fs = require('fs'), nconf = require('nconf'), fileview = require('./index');
var pkg = JSON.parse(fs.readFileSync('${__dirname}/../package.json'));

program
	.version(pkg.version)
	.description('Download, upload or view files in your dropbox account')
	.option('-t, --token <value>', 'Enter your dropbox authentication token')
	.option('-d, --download [value]', 'Enter the full dropbox path of the file to be downloaded (Downloads to working directory')
	.option('-u, --upload [value]', 'Enter the full relative path of the file to be uploaded (Uploads to the dropbox root')
	.option('-v, --view [value]', 'Enter the path of the dropbox folder to view or enter "#root" to view the root folder')
	.parse(process.argv);

	
program.on('--help', ()=>{
	console.log('  Fileview fetches authentication token from either of 2 means:');
	console.log('    **Config file at /config.json [RECOMMENDED]');
	console.log('    **Commandline option; "-t" or "--token" flag [OVERRIDES THE CONFIG');
	
});

//Run help if no argument is supplied
if(!process.argv.slice(2).length) {
	program.help();
}

nconf.argv().file({file: './config.json'});
//program.token = nconf.get('token') || nconf.get('t') || nconf.get('DROPBOX_TOKEN');


if(!program.token && !nconf.get('DROPBOX_TOKEN')) {
	throw new Error('No specified dropbox Token. Use the "-t || --token" flag or the config file');
}
else if(!program.token) {
	program.token = nconf.get('DROPBOX_TOKEN');
}

fileview(program);