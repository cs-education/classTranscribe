module.exports = function(app) {
    app.use('/first', require('./routes/first'));
    app.use('/progress', require('./routes/progress'));
    app.use('/viewProgress', require('./routes/viewProgress'));
    app.use('/download', require('./routes/download'));
    app.use('/queue', require('./routes/queue'));
    app.use('/second', require('./routes/second'));
   app.use('/login', require('./routes/login'));
}
