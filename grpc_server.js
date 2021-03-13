var PROTO_PATH = __dirname + '/view/grpc.proto';

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

var userMessageMap = new Map();

function insert(call, callback) {
  userMessageMap.set(call.request.key, {value: call.request.value});
  callback(null, {key: 'Key: ' + call.request.key, value: 'Value: ' + call.request.value});
}

function get(call, callback) {
  var requestedValue = userMessageMap.get(call.request.key);
  callback(null, { key: 'Key: ' + call.request.key, value: 'Value: ' + requestedValue.value})
}

function getAll(call, callback){
  callback(null, {userMap: JSON.stringify([...userMessageMap])});
}
/**
 * Starts an RPC server that receives requests for the CrService
 */
function main() {
  var server = new grpc.Server();
  server.addService(grpc_proto.CrService.service, {insert: insert, get: get, getAll: getAll});
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
  });
}

main();
