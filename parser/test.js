var jsonfile = require('jsonfile')
var file = 'problems.json'
jsonfile.readFile(file, function(err, obj) {
  console.dir(obj)
})
