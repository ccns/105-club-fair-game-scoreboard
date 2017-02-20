var config = require('config');

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var f = require('util').format;
var url = config.get('mongo.url');
var user = config.get('mongo.user');
var pwd = config.get('mongo.pwd');

var url = f('mongodb://%s:%s@%s', user, pwd, url);

function checkFlag(flag, callback) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    var collection = db.collection('flags');
    collection.find({"flag": flag}).toArray(function(err, docs) {
      assert.equal(err, null);
      return callback(docs);
    });
  })
}

function getUser(name, callback) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    var collection = db.collection('scores');
    collection.find({"name": name}).toArray(function(err, docs) {
      assert.equal(err, null);
      return callback(docs);
    });
  })
}

function updateUser(user, flag, callback) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    if(flag==-1) {
      var collection = db.collection('scores');
      collection.updateOne({"name": user.name}, {
        $set: {
          solved: user.solved,
          score: user.score
        }
      }, callback);
    } else {
      var fcollection = db.collection('flags');
      fcollection.updateOne({"flag": flag.flag}, {
        $set: { solved: flag.solved+1 }
      },function() {
        var collection = db.collection('scores');
        collection.updateOne({"name": user.name}, {
          $set: {
            solved: user.solved,
            score: user.score
          }
        }, callback);
      });
    }
  })
}

function addUser(name, callback) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    var collection = db.collection('scores');
    collection.insert({name: name, score: 0, solved:[]}, callback);
  })
}

function getRank(callback) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    var collection = db.collection('scores');
    collection.find({}).sort({score: -1}).toArray(function(err, docs) {
      assert.equal(err, null);
      return callback(docs);
    });
  })
}

function getProblems(callback) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    var collection = db.collection('flags');
    collection.find({}).sort({type:1, no:1}).toArray(function(err, docs) {
      assert.equal(err, null);
      docs.map(function(d) {
        delete d.flag;
        return d;
      })
      return callback(docs);
    });
  })
}

module.exports = {
  checkFlag: checkFlag,
  getUser: getUser,
  updateUser: updateUser,
  addUser: addUser,
  getRank: getRank,
  getProblems: getProblems
}
