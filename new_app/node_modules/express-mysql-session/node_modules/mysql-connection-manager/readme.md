# mysql-connection-manager

[![Build Status](https://travis-ci.org/chill117/mysql-connection-manager.svg?branch=master)](https://travis-ci.org/chill117/mysql-connection-manager)

Manages keep-alive signals, reconnections for a MySQL connection or connection pool.


## Installation

Add to your application via `npm`:
```
npm install mysql-connection-manager --save
```
This will install `mysql-connection-manager` and add it to your application's `package.json` file.


## How to Use

To have `mysql-connection-manager` create the connection for you:
```js
var MySQLConnectionManager = require('mysql-connection-manager')

var options = {
	host: 'localhost',
	port: 3306,
	user: 'db_user',
	password: 'password',
	database: 'db_name'
}

var manager = new MySQLConnectionManager(options)

manager.on('connect', function(connection) {

	// Connected!

})

// Pass the connection object to some other module, like this:
var something = new SomeThing(someOtherOptions, manager.connection)
```
The connection object is the same as provided by [node-mysql](https://github.com/felixge/node-mysql).

You can also pass an already existing [node-mysql](https://github.com/felixge/node-mysql) connection object to `mysql-connection-manager`, like this:
```js
var mysql = require('mysql')
var MySQLConnectionManager = require('mysql-connection-manager')

var options = {
	host: 'localhost',
	port: 3306,
	user: 'db_user',
	password: 'password',
	database: 'db_name'
}

var connection = mysql.createConnection(options)
var manager = new MySQLConnectionManager(options, connection)
```

To cleanly end the current connection:
```js
manager.endConnection()
```


### Events

There are a few events that can be listened for on the `manager` object:
```js
manager.on('connect', function(connection) {

	// A database connection has been established..

})

manager.on('reconnect', function(connection) {

	// The database connection has been re-established..

})

manager.on('disconnect', function() {

	// The database connection has been lost..

})
```
The `manager` object is extended with the [nodejs EventEmitter](http://nodejs.org/api/events.html), so you can use all of the methods that it provides as well: `on`, `off`, `once`, `emit`, etc.


### Options

A list of all available options:
```js
var options = {
	host: 'localhost',// Host name for database connection.
	port: 3306,// Port number for database connection.
	user: 'connect_mng_test',// Database user.
	password: 'password',// Password for the above database user.
	database: 'connect_mng_test',// Database name.
	autoReconnect: true,// Whether or not to re-establish a database connection after a disconnect.
	reconnectDelay: [
		500,// Time between each attempt in the first group of reconnection attempts; milliseconds.
		1000,// Time between each attempt in the second group of reconnection attempts; milliseconds.
		5000,// Time between each attempt in the third group of reconnection attempts; milliseconds.
		30000,// Time between each attempt in the fourth group of reconnection attempts; milliseconds.
		300000// Time between each attempt in the fifth group of reconnection attempts; milliseconds.
	],
	useConnectionPooling: false,// Whether or not to use connection pooling.
	reconnectDelayGroupSize: 5,// Number of reconnection attempts per reconnect delay value.
	maxReconnectAttempts: 25,// Maximum number of reconnection attempts. Set to 0 for unlimited.
	keepAlive: true,// Whether or not to send keep-alive pings on the database connection(s).
	keepAliveInterval: 30000,// How frequently keep-alive pings will be sent; milliseconds.
}
```

#### Reconnect Delays

The reconnect-related options may require a bit of additional explanation. With the default options shown above, the reconnect attempts will have the following delay pattern:

* Attempts __#1__ through __#5__ will have a delay of __500 milliseconds__ each.
* Attempts __#6__ through __#10__ will have a delay of __1 second__ each.
* Attempts __#11__ through __#15__ will have a delay of __5 seconds__ each.
* Attempts __#16__ through __#20__ will have a delay of __30 seconds__ each.
* Attempts __#21__ through __#25__ will have a delay of __5 minutes__ each.

If the `reconnectDelayGroupSize` was 3:

* Attempts __#1__ through __#3__ will have a delay of __500 milliseconds__ each.
* Attempts __#4__ through __#6__ will have a delay of __1 second__ each.
* Attempts __#7__ through __#9__ will have a delay of __5 seconds__ each.
* Attempts __#10__ through __#12__ will have a delay of __30 seconds__ each.
* Attempts __#13__ through __#25__ will have a delay of __5 minutes__ each.

Any reconnect attempts beyond the last value in the `reconnectDelay` array will simply use the last value from the `reconnectDelay` array.

Alternatively you may supply a single integer value to the `reconnectDelay` option to have one delay time between all reconnect attempts, like this:
```js
var options = {
	reconnectDelay: 500
}
```


### Connection Pooling

When `useConnectionPooling` is set to `TRUE`, the `manager.connection` object is a connection pool object returned by `mysql.createPool`; see [node-mysql](https://github.com/felixge/node-mysql#pooling-connections) for details.


### Debugging

`mysql-connection-manager` uses the [debug module](https://github.com/visionmedia/debug) to output debug messages to the console. To output all debug messages, run your node app with the `DEBUG` environment variable:
```
DEBUG=mysql-connection-manager node your-app.js
```
This will output log messages as well as error messages from `mysql-connection-manager`.


## Contributing

There are a number of ways you can contribute:

* **Improve or correct the documentation** - All the documentation is in this `readme.md` file. If you see a mistake, or think something should be clarified or expanded upon, please [submit a pull request](https://github.com/chill117/mysql-connection-manager/pulls/new)
* **Report a bug** - Please review [existing issues](https://github.com/chill117/mysql-connection-manager/issues) before submitting a new one; to avoid duplicates. If you can't find an issue that relates to the bug you've found, please [create a new one](https://github.com/chill117/mysql-connection-manager/issues).
* **Request a feature** - Again, please review the [existing issues](https://github.com/chill117/mysql-connection-manager/issues) before posting a feature request. If you can't find an existing one that covers your feature idea, please [create a new one](https://github.com/chill117/mysql-connection-manager/issues).
* **Fix a bug** - Have a look at the [existing issues](https://github.com/chill117/mysql-connection-manager/issues) for the project. If there's a bug in there that you'd like to tackle, please feel free to do so. I would ask that when fixing a bug, that you first create a failing test that proves the bug. Then to fix the bug, make the test pass. This should hopefully ensure that the bug never creeps into the project again. After you've done all that, you can [submit a pull request](https://github.com/chill117/mysql-connection-manager/pulls/new) with your changes.

Before you contribute code, please read through at least some of the source code for the project. I would appreciate it if any pull requests for source code changes follow the coding style of the rest of the project.

Now if you're still interested, you'll need to get your local environment configured.


### Configure Local Environment

#### Step 1: Get the Code

First, you'll need to pull down the code from GitHub:
```
git clone git@github.com:chill117/mysql-connection-manager.git
```

#### Step 2: Install Dependencies

Second, you'll need to install the project dependencies as well as the dev dependencies. To do this, simply run the following from the directory you created in step 1:
```
npm install
```

#### Step 3: Set Up the Test Database

Now, you'll need to set up a local test database:
```js
{
	host: 'localhost',
	port: 3306,
	user: 'connect_mng_test',
	password: 'password',
	database: 'connect_mng_test'
}
```
*These database credentials are located at `test/config/database.js`*


### Running Tests

With your local environment configured, running tests is as simple as:
```
npm test
```
This module supports node.js `0.8.x` and `0.10.x`. If you are planning to contribute, please test your changes against all supported versions of node. If you need help setting up multiple versions of node in your development environment, [this article](https://degreesofzero.com/article/how-to-install-multiple-versions-of-nodejs.html) can guide you through the process.