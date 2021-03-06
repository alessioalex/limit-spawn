var spawn  = require('child_process').spawn,
    limit  = require('../index'),
    assert = require('assert'),
    child, ps, bytesReceived, MAX_LIMIT;

MAX_LIMIT = 100 * 1024; // 100 Kb

child = spawn('node', ['forever-output.js'], {
  cwd: __dirname
});

limit(child, MAX_LIMIT);

bytesReceived = 0;

child.stdout.on('data', function(data) {
  bytesReceived += data.length;
});

child.stderr.pipe(process.stderr);

child.on('max-limit-exceeded', function(size) {
  console.log('limit exceeded: ' + parseInt(size / 1024, 10) + ' Kb sent');
  // the data received should not exceed the 'size' param
  assert.ok(bytesReceived <= size);
});

// shortly after the 'max-limit-exceeded' event is emitted the child dies
child.on('close', function(code) {
  console.log('child process exited');
});
