var path = require('path');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var db = require('./db');

app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res) {
  res.sendfile("index.html");
});

app.get('/api/submit', function(req, res) {
  var id = req.query.id;
  var flag = req.query.flag;
  var resp = {};
  resp.status = -1;
  resp.msg = 'Not yet send query.';
  if (typeof id !== 'undefined' && id !== '') {
    if(flag.indexOf(':')>-1) {
      db.getUser(id, function(u) {
        if(u.length == 1) {
          u = u[0];
          if(u.solved.indexOf("3-1")!=-1) {
            // Have been solved.
            resp.status = 3;
            resp.msg = 'Duplicate submit.';
            res.jsonp(resp);
          } else {
            // Solve! push solved and add score
            u.solved.push("3-1");
            u.score += 3;
            db.updateUser(u, -1, function(){
              resp.status = 0;
              resp.msg = 'Success!';
              res.jsonp(resp);
            });
          }
        } else if(u.length == 0) {
          // user not found.
          db.addUser(id, function() {
            db.getUser(id, function(u) {
              u = u[0];
              if(u.solved.indexOf("3-1")!=-1) {
                // Have been solved.
                resp.status = 3;
                resp.msg = 'Duplicate submit.';
                res.jsonp(resp);
              } else {
                // Solve! push solved and add score
                u.solved.push("3-1");
                u.score += 3;
                db.updateUser(u, -1, function(){
                  resp.status = 0;
                  resp.msg = 'Success!';
                  res.jsonp(resp);
                });
              }
            });
          })
        }
      })
    } else {
      db.checkFlag(flag, function(f) {
        if(f.length > 0) {
          f = f[0];
          console.log(f);
          db.getUser(id, function(u) {
            if(u.length == 1) {
              u = u[0];
              if(u.solved.indexOf(f.type+"-"+f.no)!=-1) {
                // Have been solved.
                resp.status = 3;
                resp.msg = 'Duplicate submit.';
                res.jsonp(resp);
              } else {
                // Solve! push solved and add score
                u.solved.push(f.type+"-"+f.no);
                u.score += f.score;
                db.updateUser(u, f, function(){
                  resp.status = 0;
                  resp.msg = 'Success!';
                  res.jsonp(resp);
                });
              }
            } else if(u.length == 0) {
              // user not found.
              db.addUser(id, function() {
                db.getUser(id, function(u) {
                  u = u[0];
                  if(u.solved.indexOf(f.type+"-"+f.no)!=-1) {
                    // Have been solved.
                    resp.status = 3;
                    resp.msg = 'Duplicate submit.';
                    res.jsonp(resp);
                  } else {
                    // Solve! push solved and add score
                    u.solved.push(f.type+"-"+f.no);
                    u.score += f.score;
                    db.updateUser(u, f, function(){
                      resp.status = 0;
                      resp.msg = 'Success!';
                      res.jsonp(resp);
                    });
                  }
                });
              })
            }
          })
        } else {
          // flag not found.
          resp.status = 1;
          resp.msg = 'Flag not found.';
          res.jsonp(resp);
        }
      })
    }
  } else {
    resp.status = 1;
    resp.msg = 'ID not set!';
    res.jsonp(resp);
  }
})

app.get('/api/new', function(req, res) {
  var id = req.query.id;
  var resp = {};
  resp.status = -1;
  resp.msg = 'Not yet send query.';
  if (typeof id !== 'undefined' && id !== '') {
    db.getUser(id, function(docs) {
      if(!docs.length) {
        db.addUser(id, function() {
          resp.status = 0;
          resp.msg = 'Success!';
          res.jsonp(resp);
        })
      } else {
        resp.status = 2;
        resp.msg = 'User duplicated!';
        res.jsonp(resp);
      }
    })
  } else {
    resp.status = 1;
    resp.msg = 'ID not set!';
    res.jsonp(resp);
  }
})

app.get('/api/rank', function(req, res) {
  var id = req.query.id;
  var resp = {};
  resp.status = -1;
  resp.msg = 'Not yet send query.';
  db.getRank(function(r) {
    resp.status = 0;
    resp.msg = 'Success!';
    resp.data = r;
    res.jsonp(resp);
  })
})

app.get('/api/problems', function(req, res) {
  var id = req.query.id;
  var resp = {};
  resp.status = -1;
  resp.msg = 'Not yet send query.';
  db.getProblems(function(r) {
    resp.status = 0;
    resp.msg = 'Success!';
    resp.data = r;
    res.jsonp(resp);
  })
})

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
})
