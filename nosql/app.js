// Include nosqldb-oraclejs module
var nosqldb = require('nosqldb-oraclejs');
 
// This is by default, if you encounter problems during your tests,
// Try to change the log level, values are available under
// nosqldb.LOG_LEVELS path:
//   OFF, FATAL, ERROR, WARN, INFO, DEBUG, TRACE, ALL
nosqldb.Logger.logLevel = nosqldb.LOG_LEVELS.INFO;
nosqldb.Logger.logToConsole = true;
nosqldb.Logger.logToFile = false;
 
// Working with types
var WriteOptions = nosqldb.Types.WriteOptions;
var Durability = nosqldb.Types.Durability;
var SyncPolicy = nosqldb.Types.SyncPolicy;
var ReplicaAckPolicy = nosqldb.Types.ReplicaAckPolicy;
var ReadOptions = nosqldb.Types.ReadOptions;
var Consistency = nosqldb.Types.SimpleConsistency;
 
var TABLE_NAME = 'example_table';
var NO_OF_ROWS = 2;
 
// Create a configuration object
var configuration = new nosqldb.Configuration();
configuration.proxy.startProxy = true;
configuration.proxy.host = 'localhost:4998';
configuration.storeHelperHosts = ['localhost:5000'];
configuration.storeName = 'mystore';
 
// Create a store with the specified configuration
var store = nosqldb.createStore(configuration);
 
// Create an open handler
store.on('open', function () {
  console.log('Connected to store');
 
  // Create a table
  store.execute(' CREATE TABLE if not exists ' + TABLE_NAME +
  ' ( id long, name string, primary key(id) ) ', function (err) {
    if (err) return;
    store.refreshTables(function (err) {
      if (err) return;
 
      console.log('Table is created.');
      console.log('Inserting data...');
      // write data in the table
      var writeOptions = new WriteOptions(
        new Durability(SyncPolicy.NO_SYNC,
          ReplicaAckPolicy.ALL, SyncPolicy.NO_SYNC), 1000);
 
      for (var putCount = 0, putCallback = 0; putCount < NO_OF_ROWS;
           putCount++) {
        // setting up the row
        var row = {id: putCount, name: 'name #' + putCount};
 
        store.put(TABLE_NAME, row, writeOptions,
          function () {
            console.log('Writing row #' + putCallback++);
          });
      }
      console.log('Reading data...');
      // read data from the table
      var readOptions = new ReadOptions(Consistency.NONE_REQUIRED, 1000);
 
      for (var getCount = 0, getCallback = 0; getCount < NO_OF_ROWS;
           getCount++) {
        // setup the primary key
        var key = {id: getCount};
 
        store.get(TABLE_NAME, key, readOptions, function (error, result) {
          console.log('Reading row #' + getCallback);
          console.log(result.currentRow);
 
          //Close the store on the last callback
          if (++getCallback === NO_OF_ROWS) {
            console.log('Closing connection...');
            store.close();
          }
        });
      }
 
    }); // RefreshTables
  }); // Execute
}).on('close', function () {
  console.log('Store connection closed.');
  console.log('Shutting down proxy.');
  store.shutdownProxy();
  console.log('Proxy closed.');
}).on('error', function (error) {
  console.log(error);
});
 
// Open the store
store.open();
