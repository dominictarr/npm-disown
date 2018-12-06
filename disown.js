var pull = require('pull-stream')
var cp = require('child_process')

var access = require('./access.json')
var rm = {}
for(var k in access)
  if(access[k] === true)
    rm[k] = true

var disowner = process.argv[2]

var modules = Object.keys(rm), n = 0
pull(
  pull.values(modules),
  pull.asyncMap(function (mod, cb) {
    console.error(mod, ++n, '/', modules.length)
    cp.exec('npm owner ls '+mod, function (err, ls) {
      function _cb (err, stdout, stderr) {
        if(stderr)
          console.error(stderr)
        cb(null, mod)
      }
      var maintainers = ls.split('\n').map(function (line) {
        return line.split(/\s/).shift()
      }).filter(Boolean)
      if(!~maintainers.indexOf(disowner)) {
        _cb(null, mod)
      }
      else if(maintainers.length > 1) {
        cp.exec('npm owner rm '+disowner+' '+mod, _cb)
      }
      else {
        var disown = 'npm owner rm '+disowner+' '+mod
        cp.exec('npm owner add nopersonsmodules '+mod+' && '+disown+'||'+disown+'||'+disown , _cb)
      }
    })
  }),
  pull.drain(function (mod) {
    console.log(mod)
  })
)


