# limit-spawn

### Description

Kills a child process created with spawn after X bytes are sent and emits an event.

### Installation

```bash
npm install limit-spawn
```
### Note

This is a soft limit, meaning that after more than MAX data is received the process is closed and the 'max-limit-exceeded' is emitted.
So this implies that you can receive more data than the limit (depending on the last chunk).

### Examples

```js
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
});

// shortly after the 'max-limit-exceeded' event is emitted the child dies
child.on('close', function(code) {
  console.log('child process exited');
});
```

### Tests

```bash
npm test
```

## License

MIT
