var express = require('express');
var app = express();
var fs = require('fs'); // reads html file so we can serve up a page, will likely change this
var formidable = require('formidable'); // process form
var nano = require('nano')('http://127.0.0.1:5984/'); // couchDB url


// START *** Settings headers to allow cross domain requests
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
// END *****


// START *** Express deals with urls
app.get('/getData', function (request, response) {
    getData(response);
});

app.get('/test', function (request, response) {
    response.send('Testing');
});
// END *****


// START *** Use Express to listen to port
app.listen(4562, function () {
    console.log('Example app listening!');
});
// END *****

// Get and return data from couchDB view - used as a webservice
function getData(response) {

    var db = nano.db.use('angular_app');
    var type = 'test';
    var rows = null;
    var dataArray = [];

    db.view('tests', 'tests', {'key': type, 'include_docs': true}, function(err, body) {
        if (!err) {
            rows = body.rows;
            rows.forEach(function(row) {
                dataArray.push(row.doc);
              });
            console.log('Got data :)');
        } else {
          console.log('noooooo');
        }

        response.setHeader('Content-Type', 'application/json');
        response.writeHead(200, {
            'content-type': 'application/json'
        });
        response.end(JSON.stringify(dataArray));
    });
}


// START *** The following functions are for get and displaying a form and then saving the form data
// Get html file and display on page
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

// process the form when submitted
function processAllFieldsOfTheForm(request, response) {
    var form = new formidable.IncomingForm();

    form.parse(request, function (err, fields, files) {
        saveData(fields);

        response.writeHead(200, {
            'content-type': 'text/plain'
        });
        response.write('received the data:\n\n');
        response.end();
    });
}

// Save the data from the form to couchDB
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
            console.log('done :D');
        } else {
          console.log('fail :(');
        }
    });
}
// END *****

