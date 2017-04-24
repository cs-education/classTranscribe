//use this file like script on node
//node <file name>
//also could be used be used by pull data from results

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '192.17.90.133',
  user     : 'adammoy2_piwik',
  password : 'piwik492',
  database : 'adammoy2_classTranscribeDev'
});
 
connection.connect();

connection.query('SELECT * FROM piwik_log_link_visit_action', function (error, results, fields) {
  if (error) throw error;
    for(var i = 0; i < results.length; i++){
        console.log(results[i]);
    }
});
 
connection.end();
