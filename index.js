/**
 * Limit the output of `child_process.spawn` to a number of bytes
 * and kill the child process if it exceeds that size.
 *
 * @param {Object} ps - ChildProcess object
 * @param {Number} max
 * @return {Object} ps - ChildProcess object
 */
function limit(ps, max) {
  var size;

  if (!limit) { return ps; }

  size = 0;

  ps.stdout.on('data', function(data) {
    size += data.length;

    if (size > max) {
      // data could still be emitted before the process closes
      ps.stdout.removeAllListeners('data');
      ps.emit('max-limit-exceeded', size);
      ps.kill('SIGHUP');
    }
  });

  return ps;
}

module.exports = limit;
