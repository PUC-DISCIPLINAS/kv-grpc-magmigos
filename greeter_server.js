/*
 *
 * Copyright 2015 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

var PROTO_PATH = __dirname + '/view/helloworld.proto';

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
var hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

var userMessageMap = new Map();

/**
 * Implements the SayHello RPC method.
 */
function insert(call, callback) {
  userMessageMap.set(call.request.key, {value: call.request.value});
  callback(null, {key: 'Key: ' + call.request.key, value: 'Value: ' + call.request.value});
}

function get(call, callback) {
  var requestedValue = userMessageMap.get(call.request.key);
  callback(null, { key: 'Key: ' + call.request.key, value: 'Value: ' + requestedValue.value})
}

function getAll(call, callback){
  console.log(userMessageMap);
  callback(null, {userMap: JSON.stringify([...userMessageMap])});
}
/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
  var server = new grpc.Server();
  server.addService(hello_proto.Greeter.service, {insert: insert, get: get, getAll: getAll});
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
  });
}

main();
