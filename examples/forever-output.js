setInterval(function() {
  for (var i = 0; i < 10000; i++) {
    process.stdout.write('blablablabla' + i);
  }
}, 200);
