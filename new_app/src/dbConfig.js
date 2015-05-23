/**
 * Created by omelvin on 5/21/15.
 */

exports.mongoConfig = {
    server: {
        poolSize: 10,
        socketOptions: {keepAlive: 1}
    },
    replset: {
        socketOptions: {keepAlive: 1}
    }
    //user: '',
    //pass: ''
};

exports.mongoURI = 'mongodb://localhost:27017/test';