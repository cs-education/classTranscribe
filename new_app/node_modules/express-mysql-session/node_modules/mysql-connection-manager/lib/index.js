var debug = require('debug')('mysql-connection-manager')
var EventEmitter = require('events').EventEmitter
var mysql = require('mysql')

var defaultOptions = {
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

var MySQLConnectionManager = module.exports = function(options, connection) {

	if (connection && connection._MySQLConnectionManager)
		return connection._MySQLConnectionManager

	this.options = options || {}
	this.connection = connection || null

	this.initialize()

}

// Extend the MySQLConnectionManager prototype with the EventEmitter's prototype.
for (var key in EventEmitter.prototype)
	MySQLConnectionManager.prototype[key] = EventEmitter.prototype[key]

MySQLConnectionManager.prototype.initialize = function() {

	debug('Initializing')

	this._connected = false
	this._numFailedReconnectAttempts = 0

	this.setDefaultOptions()

	if (!this.connection)
		this.reconnect()

}

MySQLConnectionManager.prototype.connect = function(cb) {

	if (this.options.useConnectionPooling)
		this.createPool(cb)
	else
		this.createConnection(cb)

}

MySQLConnectionManager.prototype.createConnection = function(cb) {

	debug('Creating new database connection')

	var connection = mysql.createConnection(this.options)

	connection.connect(function(error) {

		if (error)
		{
			connection.destroy()
			return cb(error)
		}

		cb(null, connection)

	})

	this._saveConnectionObject(connection)

}

MySQLConnectionManager.prototype.createPool = function(cb) {

	debug('Creating new database connection pool')

	var connection = mysql.createPool(this.options)

	connection.once('error', function(error) {

		connection.destroy()
		cb(error)

	})

	connection.once('connection', function() {

		cb(null, connection)

	})

	this._saveConnectionObject(connection)

}

MySQLConnectionManager.prototype.endConnection = function(cb) {

	debug('Ending database connection')

	this.clearKeepAliveInterval()

	if (this.connection)
		this.connection.end(cb)

}

MySQLConnectionManager.prototype._saveConnectionObject = function(newConnection) {

	newConnection._MySQLConnectionManager = this

	if (!this.connection)
		this.connection = newConnection
	else
	{
		for (var key in newConnection)
			this.connection[key] = newConnection[key]

		for (var key in this.connection)
			if (typeof newConnection[key] == 'undefined')
				this.connection[key] = undefined
	}

}

MySQLConnectionManager.prototype.waitThenAttemptReconnect = function() {

	if (this.hasExceededMaxNumberOfReconnectAttempts())
	{
		// No more attempts..
		debug('Maximum number of reconnect attempts has been reached')
		return
	}

	var delay = this.getReconnectDelay()
	var self = this

	setTimeout(function() {

		self.reconnect()

	}, delay)

}

MySQLConnectionManager.prototype.reconnect = function() {

	debug('Attempting to establish connection')

	var self = this

	this.connect(function(error) {

		if (error)
		{
			debug('Failed to establish connection: "' + error.code + '"')
			self._numFailedReconnectAttempts++
			self.waitThenAttemptReconnect()
			return
		}

		debug('Connection has been established')

		self.connected()

	})

}

MySQLConnectionManager.prototype.connected = function() {

	this.connection.state = 'authenticated'

	this.listenForDisconnect()

	this._connected = true

	if (this.options.keepAlive)
		this.setKeepAliveInterval()

	this.emit('reconnect', this.connection)
	this.emit('connect', this.connection)

}

MySQLConnectionManager.prototype.listenForDisconnect = function() {

	if (
		this.options.useConnectionPooling ||
		!this.options.autoReconnect
	)
	{
		debug('NOT listening for disconnects')

		// Have to catch connection errors somewhere.
		this.connection.on('error', function() {})

		return
	}

	debug('Listening for disconnects')

	var self = this

	this.connection.on('error', function(error) {

		debug('Connection error: "' + error.code + '"')

		if (error.code == 'PROTOCOL_CONNECTION_LOST')
			self.disconnected()

	})

}

MySQLConnectionManager.prototype.disconnected = function() {

	if (!this._connected)
		// Already disconnected..
		return

	debug('Connection to database has been lost')

	this.connection.removeAllListeners('error')

	this._connected = false
	this._numFailedReconnectAttempts = 0

	// Stop sending keep-alive signals.
	this.clearKeepAliveInterval()

	this.emit('disconnect')

	this.waitThenAttemptReconnect()

}

MySQLConnectionManager.prototype.hasExceededMaxNumberOfReconnectAttempts = function() {

	return 	this.options.maxReconnectAttempts &&
			this._numFailedReconnectAttempts >= this.options.maxReconnectAttempts - 1

}

MySQLConnectionManager.prototype.getReconnectDelay = function() {

	if (!(this.options.reconnectDelay instanceof Array))
		return this.options.reconnectDelay

	var numGroups = this.options.reconnectDelay.length
	var groupSize = this.options.reconnectDelayGroupSize
	var attemptNumber = this._numFailedReconnectAttempts + 1
	var groupIndex = Math.floor(attemptNumber / groupSize)

	return this.options.reconnectDelay[groupIndex] || this.options.reconnectDelay[numGroups - 1]

}

MySQLConnectionManager.prototype.setDefaultOptions = function() {

	for (var name in defaultOptions)
		if (typeof this.options[name] == 'undefined')
			this.options[name] = defaultOptions[name]

}

MySQLConnectionManager.prototype.keepAlive = function(cb) {

	debug('Sending keep-alive signal')

	var self = this

	if (!this.options.useConnectionPooling)
		return this.connection.ping(cb)

	this.connection.getConnection(function(error, connection) {

		if (error)
			return cb && cb(error)

		connection.ping(cb)
		connection.release()

	})

}

MySQLConnectionManager.prototype.setKeepAliveInterval = function(interval) {

	this.clearKeepAliveInterval()

	var self = this

	this._keepAliveInterval = setInterval(function() {

		self.keepAlive(function(error) {

			if (error)
			{
				debug('Connection error: "' + error.code + '"')

				if (error.fatal)
					self.disconnected()
			}
			else
			{
				debug('Connection OK')
			}

		})

	}, interval || this.options.keepAliveInterval)

}

MySQLConnectionManager.prototype.clearKeepAliveInterval = function() {

	clearInterval(this._keepAliveInterval)

}

MySQLConnectionManager.prototype.isConnected = function() {

	return this._connected

}
