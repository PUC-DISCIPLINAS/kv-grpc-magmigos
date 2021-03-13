Trabalho de rpc utlizando Nodejs e gRPC

Autores: 
* Arthur Gramiscelli Branco
* Lucas Guilherme Verdan Moreira

Como rodar:

1. Execute o servidor: 
  * `node grpc_server.js`

2. Em outra janela do terminal, execute o cliente passando os parametros (ação) (chave) (valor). Lista  de ações:
  * insert
  * get
  * getAll

  Exemplos:
  * `node grpc_client.js insert chave valor`
  * `node grpc_client.js get chave`
  * `node grpc_client.js getAll`
