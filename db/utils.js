
/* wrapper function to print error */
function perror(err) {

  /* change font to red, print err message to stderr */
  console.error('\x1b[31m' + err);

  /* print trace */
  console.trace();

  /* reset color */
  console.log('\x1b[0m');
}

/* wrapper function to print value */
function info(value) {

  /* write without newline */
  process.stdout.write('\x1b[33m');

  /* change font to yellow, print value, and reset font color */
  console.log(value);

  /* write without newline */
  process.stdout.write('\x1b[0m');
}

/* wrapper function to print general logs */
function log(log) {

  /* change font to cran, print value, and reset font color */
  console.log('\x1b[36m' + log + '\x1b[0m');
}

module.exports = {
  perror : perror,
  info : info,
  log : log,
}
