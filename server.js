var http = require("http");
var fs = require('fs');
var formidable = require('formidable');
var util = require('util');
var nano = require('nano')('http://127.0.0.1:5984/');

var server = http.createServer(function(request, response) {

  if (request.method.toLowerCase() === 'get') {
    displayForm(response);
  } else if (request.method.toLowerCase() === 'post') {
    processAllFieldsOfTheForm(request, response);
  }

}).listen(8888);


function displayForm(response) {
    fs.readFile('form.html', function (err, data) {
        response.writeHead(200, {
            'Content-Type': 'text/html',
            'Content-Length': data.length
        });
        response.write(data);
        response.end();
    });
}

function processAllFieldsOfTheForm(request, response) {
    var form = new formidable.IncomingForm();

    form.parse(request, function (err, fields, files) {
        saveData(fields);

        response.writeHead(200, {
            'content-type': 'text/plain'
        });
        response.write('received the data:\n\n');
        response.end(util.inspect({
            fields: fields,
            files: files
        }));
    });
}

function saveData(fields) {
    console.log('fields');
    console.log(fields);
    var test_db = nano.db.use('angular_app');

    var data = {
        "name": fields.name,
        "email": fields.email,
        "description": fields.description
    };

    console.log('data');
    console.log(data);

    test_db.insert(data, function(err, body) {
        if (!err) {
            console.log('done');
            //awesome
        } else {
          console.log('fail :(');
        }
    });
}
