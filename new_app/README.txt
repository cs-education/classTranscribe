The MongoDB is currently set up to be run locally

simply create a file named dbConfig.js in the new_app directory that contains -

exports.mongoConfig = {
    server: {
        poolSize: 10,
        socketOptions: {keepAlive: 1}
    },
    replset: {
        socketOptions: {keepAlive: 1}
    }
};

exports.mongoURI = 'mongodb://localhost:27017/test';

//end of dbConfig file

to start the DB navigate to the new_app directory in terminal and run 'mongod --dbpath data/db'