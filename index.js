'use strict';

const Dropbox = require('dropbox'), fs = require('fs'), path = require('path');
//let dbx = new Dropbox({accessToken: });

function fileview(arg){
	if(arg.upload) {upload(arg.upload)}
	else if (arg.view) {show(arg.view)}
	else if (arg.download) {download(arg.download)}
	else {
		console.log('Error: unknown arguments please run --help || -h');
		process.exit(1);
	}
}


//Function to upload a file to dropbox
var upload = (arg)=>{
	var dbx = new Dropbox({accessToken: arg.token});
	return fs.readFile(arg.upload, (err, file)=>{
		if(err) throw err;
		//console.log(JSON.stringify(file));
		dbx.filesUpload({
			'contents': file,
			'path': '/' + path.basename(arg.upload),
			//'mode': {'.tag': 'update'},
			'autorename': true,
			'mute': true
		}).then(res=>{console.log("Done uploading: " + JSON.stringify(res, null, 2))})
		.catch(err=>{console.error("Something went wrong: %s", JSON.stringify(err, null, 2))});
	});
};

//Function to view files in Dropbox
var show = (arg)=>{
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

module.exports = fileview;