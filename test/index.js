var test  = require('tap').test,
    spawn = require('child_process').spawn,
    limit = require('../');

test("limit child process", function(t) {
  var child, MAX_LIMIT, buf, exceeded;

  MAX_LIMIT = 100 * 1024; // 100 Kb

  t.plan(2);

  // use that node script so the tests can be run in Windows
  child = spawn('node', [
    __dirname + '/lib/forever-output.js'
  ], {
    cwd: __dirname
  });

  limit(child, MAX_LIMIT);

  buf = 0;

  child.stdout.on('data', function(data) {
    buf += data.length;
  });

  child.stderr.pipe(process.stderr);

  child.on('max-limit-exceeded', function(size) {
    exceeded = size;
    t.ok(true);
  });

  child.on('close', function(code) {
    t.ok(buf <= exceeded, 'no data sent after max limit reached');
    t.end();
  });
});
