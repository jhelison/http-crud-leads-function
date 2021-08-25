# AWS Lambda/Gateway Auto Deploy Repository
The repository serves to manage the files that are deployed on AWS lambda using github actions.
 
:bangbang: This is under construction! See the todo list at the end for more details.

## Table of contents

- [AWS Lambda/Gateway Auto Deploy Repository](#aws-lambda-gateway-auto-deploy-repository)
  * [How it works.](#how-it-works)
    + [How the AWS server works.](#how-the-aws-server-works)
    + [How does Github actions work.](#how-does-github-actions-work)
  * [Acess to the server](#acess-to-the-server)
    + [GET on all the items](#get-on-all-the-items)
    + [GET on specific item](#get-on-specific-item)
    + [Delete item](#delete-item)
    + [New item](#new-item)
  * [Todo](#todo)
  * [Changelog](#changelog)
 
## How it works.
 
### How the AWS server works.
Within AWS we have the following components:
- AWS DynamoDB which serves as a key pair table.
- AWS Lambda connecting our API Gateway with DynamoDB.
- AWS Gateway that manages access to our routes.
 
### How does Github actions work.
The github action uploads the `index.js` file into AWS Lambda using the following steps:
- Inside the `.github\workflows` we have the `main.yml` file that builds a VM inside Github, starting a ubuntu server that make the deploy.
- The file `index.js` passes through NCC for unification.
- The output dist is ziped.
- Finnaly the ziped file is passed to AWS lambda server.
 
AWS access management is done using an automated IAM user to access server acess keys.
 
## Acess to the server
Inside our API Gateway, we have the link https://g0deojz10k.execute-api.us-east-2.amazonaws.com, were we make the request to our routes.
 
Our api have the following routes:
 
### GET on all the items
 
```http
  GET /items
```
Returns the items list with the following structure:
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
 
### GET on specific item
 
```http
  GET /items/{id}
```
Where id is the id of the item without the brackets.
Returns the item in Dynamo with the following structure:
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
 
If the item is not found, it returns:
```json
{}
```

### Delete item

```http
  DELETE /items/{id}
```
Where id is the id of the item without the brackets.
Returns:
`Deleted item {id}`
 
### New item
 
```http
  PUT /items
```
 
The item must be send with the following structure with `Content-Type: application/json`:
 
```json
{
  "id": ...,
  "name": ...,
  "email": ...,
  "fone": ...
}
```
 
Remembering that as dynamo uses key pair, if the id has already been registered, the item with the id will be updated.
Returns:
`Put item {id}`
 
## Todo
 
- [ ]  Put the email as id.
- [ ]  Validate email.
- [ ]  Create the created at column.
- [ ]  Create the last update at column.
- [ ]  Create status column.
- [ ]  Create an http patch method.
- [ ]  Add correct http status to each method.
- [ ]  Create Search Methods Using Parameters.

## Changelog
### 1.0.1 25/08/2021
- Changed the language of the project.
### 1.0.0 24/08/2021
- First version of the project with basic functionality.