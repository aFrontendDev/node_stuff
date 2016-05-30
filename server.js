var http = require('http');
var express = require('express');
//var app = express();
var fs = require('fs');
var formidable = require('formidable');
var util = require('util');
var nano = require('nano')('http://127.0.0.1:5984/');
var dispatcher = require('httpdispatcher');

console.log('1');

var server = http.createServer(function(request, res) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    getData(res);

    //dispatcher.dispatch(request, response);

    // response.writeHead(200, {'Content-Type': 'text/plain'});
    // response.end('Index');

    // if (request.method.toLowerCase() === 'get') {
    // displayForm(response);
    // } else if (request.method.toLowerCase() === 'post') {
    // processAllFieldsOfTheForm(request, response);
    // }

}).listen(4562);


// app.all('*', function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });

// app.get('/test', function (request, response) {
//     response.send('hello world');
//     console.log('express details');
//     getData(response);
// });

// app.listen(4562, function () {
//     console.log('Example app listening on port 3000!');
// });

// dispatcher.onGet("/page1", function(request, response) {
//     // res.writeHead(200, {'Content-Type': 'text/plain'});
//     // res.end('Page One');
//     getData(response);
// });

// console.log('2');

// var serverRead = http.createServer(function(request, response) {
//     getData(response);
// }).listen(8081);

function getData(response) {

    var db = nano.db.use('angular_app');
    var type = 'test';
    var rows = null;
    var dataArray = [];

    console.log('2.1');

    db.view('tests', 'tests', {'key': type, 'include_docs': true}, function(err, body) {
        if (!err) {
            console.log('2.2');
            rows = body.rows;
            rows.forEach(function(row) {
            dataArray.push(row.doc);
          });
        } else {
          console.log('noooooo');
        }

        console.log('2.3');
        console.log(dataArray);

        response.setHeader('Content-Type', 'application/json');
        response.writeHead(200, {
            'content-type': 'application/json'
        });
        // response.write('showing data:\n\n');
        // response.end(util.inspect({
        //     rows: dataArray
        // }));
        response.end(JSON.stringify(dataArray));
        //response.end(dataArray);
    });
}

console.log('3');


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

console.log('4');

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

console.log('5');

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
            //awesome
        } else {
          console.log('fail :(');
        }
    });
}

console.log('6');
