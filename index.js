'use strict';

const Dropbox = require('dropbox'), fs = require('fs'), path = require('path');

function fileview(arg){
	if(arg.upload) {upload(arg)}
	else if (arg.view) {view(arg)}
	else if (arg.download) {download(arg)}
	else if (arg.disable) {disable(arg)}
	else {
		console.log('Error: unknown arguments. Please run --help || -h');
		process.exit(1);
	}
}


//Function to upload a file to dropbox
var upload = (arg)=>{
	var dbx = new Dropbox({accessToken: arg.token});
	return fs.readFile(arg.upload, (err, file)=>{
		if(err) throw err;
		dbx.filesUpload({
			'contents': file,
			'path': '/' + path.basename(arg.upload),
			'autorename': true,
			'mute': true
		}).then(res=>{console.log("Done uploading: " + JSON.stringify(res, null, 2))})
		.catch(err=>{console.error("Something went wrong: %s", JSON.stringify(err, null, 2))});
	});
};

//Function to view files in Dropbox
var view = (arg)=>{
	var dbx = new Dropbox({accessToken: arg.token});
	if (arg.view === '#root') {arg.view = ''};
	return dbx.filesListFolder({path: arg.view})
	.then(res => {
		var files = 'This is the list of folders and files in the requested directory: ', size = '', list = res.entries;
		for (let i=0; i<list.length; i++) {
			if (!list[i].size) {size = ''}
			else {size = '\nSize: ' + list[i].size + ' Bytes'}
			files += '\nName: ' + list[i].name + '\nType: ' + list[i]['.tag'] + size + '\n';
		}
		console.log(files)})
	.catch(err => {console.log(err)});
};

//Function to download file from dropbox
var download = (arg)=>{
	var dbx = new Dropbox({accessToken: arg.token});
	return dbx.filesDownload({path: arg.download})
	.then(res=>{
		fs.writeFileSync(res.name, res.fileBinary, 'binary', err=>{
			if(err) throw err;
		});
		console.log("Done downloading: " + JSON.stringify(res, null, 2))})
	.catch(err=>{console.error("Something went wrong: %s", JSON.stringify(err, null, 2))});
};

//Function to diable access token
var disable = (arg)=>{
	var dbx = new Dropbox({accessToken: arg.token});
	return dbx.authTokenRevoke()
	.then(()=>{console.log('Access token successfully revoked')})
	.catch(err=>{console.log('Something went wrong: ' + err)});
}

module.exports = fileview;