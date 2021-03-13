var PROTO_PATH = __dirname + '/view/grpc.proto';

var parseArgs = require('minimist');
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var grpc_proto = grpc.loadPackageDefinition(packageDefinition).grpc;

function main() {
  var argv = parseArgs(process.argv.slice(2), {
    string: 'target'
  });
  var target = 'localhost:50051';

  var client = new grpc_proto.CrService(target,
                                       grpc.credentials.createInsecure());
  var command;
  var key;
  var value;
  if (argv._.length > 0) {
    command = argv._[0];
    key = argv._[1]; 
    value = argv._[2];
  } else {
    key = 'default key';
    value = 'default value';
  }
  switch(command) {
    case 'get': {
      client.get({key: key}, function(err, response) {
        console.log(response.key);
        console.log(response.value);
      });
      break;
    }
    case 'insert': {
      client.insert({key: key, value: value}, function(err, response) {
        console.log(response.key);
        console.log(response.value);
      });
    }
    break;
    case 'getAll': {
      client.getAll({}, function(err, response) {
        console.log(JSON.parse(response.userMap));
      })
      break;
    }
    default: console.log('Missing args');
  };
}

main();
