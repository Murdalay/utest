var express = require('express'),
    fs = require('fs');
    app = express();

app.post('/testy', function(req, res){
  var body = '';
  var header = '';
  var content_type = req.headers['content-type'];
  var boundary = content_type.split('; ')[1].split('=')[1];
  var content_length = parseInt(req.headers['content-length']);
  var headerFlag = true;
  var filename = 'dummy.bin';
  var filenameRegexp = /filename="(.*)"/m;
  console.log('content-type: ' + content_type);
  console.log('boundary: ' + boundary);
  console.log('content-length: ' + content_length);

  req.on('data', function(raw) {
    // console.log('received data length: ' + raw.length);
    var i = 0;
    while (i < raw.length)
      if (headerFlag) {
        var chars = raw.slice(i, i+4).toString();
        if (chars === '\r\n\r\n') {
          headerFlag = false;
          header = raw.slice(0, i+4).toString();
          console.log('header length: ' + header.length);
          // console.log('header: ');
          // console.log(header);
          i = i + 4;
          // get the filename
          var result = filenameRegexp.exec(header);
          if (result[1]) {
            filename = result[1];
          }
          console.log('filename: ' + filename);
          console.log('header done');
        }
        else {
          i += 1;
        }
      }
      else { 
        // parsing body including footer
        body += raw.toString('binary', i, raw.length);
        i = raw.length;
        console.log('actual file size: ' + body.length);
      }
  });

  req.on('end', function() {
    // removing footer '\r\n'--boundary--\r\n' = (boundary.length + 8)
    body = body.slice(0, body.length - (boundary.length + 8))
    console.log('final file size: ' + body.length);
    fs.writeFileSync('files/' + filename, body, 'binary');
    console.log('done');
    res.redirect('back');
  })
});  

app.get('/testy', function(req, res){
  res.send('<form method="post" action="/testy" enctype="multipart/form-data">'
           + '<p>Image: <input type="file" name="test" /></p>'
           + '<p><input type="submit" value="Upload" /></p>'
           + '</form>');
});

app.listen(4000);
