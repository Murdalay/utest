var express = require('express'),
    multer  = require('multer'),
    app = express();


app.use(multer({ dest: './files/', 
	rename : function(fieldname, filename) {
	    return filename;
	},
	onFileUploadStart: function (file) {
		console.log(file.originalname + ' is starting ...')
	},
	onFileUploadComplete: function (file) {
		console.log(file.fieldname + ' uploaded to  ' + file.path)
		done=true;
	}
}));

app.post('/', function(req, res){
	if(done==true){
		res.end('File uploaded.');
	}
});

app.get('/', function(req, res){
  res.send('<form method="post" action="/" enctype="multipart/form-data">'
           + '<p>Image: <input type="file" name="test" /></p>'
           + '<p><input type="submit" value="Upload" /></p>'
           + '</form>');
});

app.listen(3000);
