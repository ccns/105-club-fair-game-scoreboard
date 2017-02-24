var config = require('config');

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var f = require('util').format;
var url = config.get('mongo.url');
var user = config.get('mongo.user');
var pwd = config.get('mongo.pwd');

var url = f('mongodb://%s:%s@%s', user, pwd, url);

var jsonfile = require('jsonfile')
var file = 'parser/problems.json'

jsonfile.readFile(file, function(err, obj) {
  obj.map(function(o) {
    o.score = parseInt(o.score);
    o.solved = parseInt(o.solved);
    return o;
  })
  console.dir(obj);
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    var collection = db.collection('flags');
    collection.remove();
    collection.insertMany(obj);
    db.close();
  })
})
