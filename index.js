'use strict';

var Dropbox = require('dropbox');
var fs = require('fs');

var token = '8-MUGhlClpsAAAAAAAAAI083fhbB4n2x3bn-Xl9CjJ0xTgg48oR2wufjjgKViVZQ';

var dbx = new Dropbox({accessToken: token});

//Function to upload a file to dropbox
var upload = ()=>{
	return fs.readFile('./pic.jpg', (err, file)=>{
		if(err) throw err;
		console.log(JSON.stringify(file));
		dbx.filesUpload({
			'contents': file,
			'path': '/texe.jpg',
			//'mode': {'.tag': 'update'},
			'autorename': true,
			'mute': true
		}).then(res=>{console.log("Alles gut: " + JSON.stringify(res, null, 2))})
		.catch(err=>{console.error("Alles schlecht: %s", JSON.stringify(err, null, 2))});
	});
};

//Function to view files in Dropbox
var show = ()=>{
	return dbx.filesListFolder({path: '/alles deutsch'})
	.then(res => {
		var files = 'This is the list of folders in the current directory: ', size = '', list = res.entries;
		for (let i=0; i<list.length; i++) {
			if (!list[i].size) {size = ''}
			else {size = '\nSize: ' + list[i].size + ' Bytes'}
			files += '\nName: ' + list[i].name + '\nType: ' + list[i]['.tag'] + size + '\n';
		}
		console.log(files)})
	.catch(err => {console.log(err)});
};

//Function to download file from dropbox
var download = ()=>{
	return dbx.filesDownload({path: '/texe.jpg'})
	.then(res=>{
		fs.writeFileSync(res.name, res.fileBinary, 'binary', err=>{
			if(err) throw err;
		});
		console.log("Alles gut: " + JSON.stringify(res, null, 2))})
	.catch(err=>{console.error("Alles schlecht: %s", JSON.stringify(err, null, 2))});
};


/*
if(process.argv[2] === '-d' && process.argv[3]) {
	var file = fs.createWriteStream('db.zip');
	dbx.filesDownload({path: process.argv[3]})
	.then(data=>{
		file.pipe(data);
		console.log('Your file was downloaded \n');
	}, error=>{
		console.log(error);
	});
} else {console.log('did nothing')}*/

//dbx.filesAlphaGetMetadata({path: process.argv[3]})
//.then(res=>{console.log(res)}, err=>{console.error('opps: ' + JSON.stringify(err)});