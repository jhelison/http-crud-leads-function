# Repositorio de deploy automático AWS lambda/gateway
O repositório serve para administrar os arquivos que são deployados na AWS lambda usando github actions.
 
:bangbang: Repositório em Construção! Vejo item To Do para mais detalhes
 
## Funcionamento Geral 
 
### Como funciona o servidor na AWS.
Dentro da AWS temos os seguintes componentes:
- AWS DynamoDB que serve como uma tabela par chave.
- AWS Lambda que conect nosso API Gateway com o DynamoDB
- AWS Gateway que gerencia os acessos a nossa URL
 
### Como funciona a Github action.
A github action faz upload do arquivo `index.js` para dentro da AWS Lambda usando os seguintes passo:
- Dentro de `.github\workflows` temos o `main.yml` que cria uma VM dentro do Github, iniciando um sistema Ubuntu que faz o deploy.
- O arquivo index.js passa pelo NCC para unificação
- O mesmo é zipado
- Finalmente o arquivo zip é deployado no AWS Lambda.
 
O gerenciamento de acesso ao AWS é feito usando um usuário automatizado IAM, para acesso as keys do servidor.
 
## Acesso ao servidor
Dentro da nossa API Gateway, temos acesso ao link https://g0deojz10k.execute-api.us-east-2.amazonaws.com, onde temos acesso a nossa API.
 
A nossa api tem as seguintes rotas:
 
### Todos os items
 
```http
  GET /items
```
Retorna a listagem de items no Dynamo com a seguintes estrutura:
```json
  {
  "Items": [
    {
      "id": ...,
      "email": ...,
      "name": ...,
      "fone": ...
    },
    {
      "id": ...,
      "email": ...,
      "name": ...,
      "fone": ...
    }
  ],
  "Count": 2,
  "ScannedCount": 2
}
```
 
### Item especifico
 
```http
  GET /item/{id}
```
Onde id é a id do item sem o colchetes.
Retorna o item no Dynamo com a seguintes estrutura:
```json
{
  "Item": {
    "id": ...,
    "email": ...,
    "name": ...,
    "fone": ...
  }
}
```
 
Caso o item não seja encontrado retorna:
```json
{}
```
 
### Cadastro de item
 
```http
  PUT /items
```
 
O item deve ser cadastro com a seguinte estrutura em um `Content-Type: application/json`:
 
```json
{
  "id": ...,
  "name": ...,
  "email": ...,
  "fone": ...
}
```
 
Lembrando que como o dynamo usa par chave, caso o id já tenha sido cadastrada, o item com a id será atualizado.
 
## Todo
 
- [ ]  Colocar o email como id.
- [ ]  Fazer validação no email.
- [ ]  Criar a coluna de data criação.
- [ ]  Criar a coluna de última atualização.
- [ ]  Criar a coluna de status.
- [ ]  Criar um método http patch.
- [ ]  Criar métodos de pesquisa usando parâmetros.

## Changelog
### 1.0.1 25/08/2021
- Corrigido metodo GET de `/items/{id}` para `/item/{id}`
### 1.0.0 25/08/2021
- Adicionada funcionalidade basica do sistema.