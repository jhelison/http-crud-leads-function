# AWS Lambda/Gateway Auto Deploy Repository
The repository serves to manage the files that are deployed on **AWS lambda** using github actions.
 
:bangbang: This is under construction! See the todo list at the end for more details.

## Table of contents

- [AWS Lambda/Gateway Auto Deploy Repository](#aws-lambda-gateway-auto-deploy-repository)
  * [Table of contents](#table-of-contents)
  * [How it works.](#how-it-works)
    + [How the AWS server works.](#how-the-aws-server-works)
    + [How does Github actions work.](#how-does-github-actions-work)
  * [Acess to the server](#acess-to-the-server)
    + [GET /items - All items](#get--items---all-items)
      - [Status codes](#status-codes)
    + [PUT /items - New item](#put--items---new-item)
      - [Status codes](#status-codes-1)
    + [GET /items/{email} - Specific item](#get--items--email----specific-item)
      - [Status codes](#status-codes-2)
    + [DELETE /items/{email} - Delete item](#delete--items--email----delete-item)
      - [Status codes](#status-codes-3)
    + [PATCH /item/{email} - Update on specific columns](#patch--item--email----update-on-specific-columns)
      - [Status codes](#status-codes-4)
    + [POST /item/{email} - Replace the item with email](#post--item--email----replace-the-item-with-email)
      - [Status codes](#status-codes-5)
  * [Todo](#todo)
  * [Changelog](#changelog)
 
## How it works.
 
### How the AWS server works.
Within **AWS** we have the following components:
- **AWS DynamoDB** which serves as a key pair table.
- **AWS Lambda** connecting our **API Gateway** with **DynamoDB**.
- **AWS Gateway** that manages access to our routes.
 
### How does Github actions work.
The github action uploads the `index.js` file into **AWS Lambda** using the following steps:
- Inside the `.github\workflows` we have the `main.yml` file that builds a VM inside **Github**, starting a ubuntu server that make the deploy.
- The file `index.js` passes through NCC for unification.
- The output dist is ziped.
- Finnaly the ziped file is passed to **AWS lambda server**.
 
**AWS** access management is done using an automated IAM user to access server acess keys.
 
## Acess to the server
Inside our API Gateway, we have the link https://g0deojz10k.execute-api.us-east-2.amazonaws.com, were we make the request to our routes.

On the DynamoDB we are going to use the following columns structure:

- email: This is our primary key, when the put method is called it passes trought a basic validation.
- name: The name of the user.
- fone: It have to be numeric.
- createdAt: When the rows was created, is automatically generated, in Epoch with ms.
- status: Have to be "prospect" or "client". It is set do default "prospoct".
- lastUpdatedAt: When the rows was last updated, is automatically generated, in Epoch with ms.
- customerAt: When the status "propspect" was changed to "customer", in Epoch with ms.

:bangbang: Everytime the status is changed from "prospect" to "customer" the customerAt is updated.
 
Our api have the following routes:
 
### GET /items - All items
 
```http
  GET /items
```
Returns the items list with the following structure:
```json
{
  "Items": [
    {
      "status": ...,
      "createdAt": ...,
      "lastUpdatedAt": ...,
      "email": ...,
      "name": ...,
      "fone": ...
    }
  ],
  "Count": 1,
  "ScannedCount": 1
}
```

#### Status codes
[200](https://httpstatuses.com/200)

### PUT /items - New item
 
```http
  PUT /items
```
 
The item must be send with the following structure:
 
```json
{
  "email": ...,
  "name": ...,
  "fone": ...,
  "status": ... (optional)
}
```
 
Remembering that as dynamo uses key pair.
Returns:

```json
{
  "email": ...,
  "name": ...,
  "fone": ...,
  "createdAt": ...,
  "status": ...,
  "lastUpdatedAt": ...
}
```

#### Status codes
- [201](https://httpstatuses.com/201).
- [409](https://httpstatuses.com/409), when the email is alread on DynamoDB.

### GET /items/{email} - Specific item
 
```http
  GET /items/{email}
```
Where email is the email of the item without the brackets.
Returns the item in Dynamo with the following structure:
```json
{
  "Item": {
    "status": ...,
    "createdAt": ...,
    "lastUpdatedAt": ...,
    "email": ...,
    "name": ...,
    "fone": ...
  }
}
```
#### Status codes
- [200](https://httpstatuses.com/200).
- [404](https://httpstatuses.com/404).


### DELETE /items/{email} - Delete item

```http
  DELETE /items/{email}
```
Where email is the email of the item without the brackets.

#### Status codes
- [204](https://httpstatuses.com/204).
- [404](https://httpstatuses.com/404).

### PATCH /item/{email} - Update on specific columns

```http
  PATCH /item/{email}
```
On the Json body, columns can be send to update the item. It keeps all the other columns as it is on DynamoDB.

Example:
```json
{
	"name": "much name! such easy! wow!"
}
```

It returns the full item:
```json
{
  "status": ...,
  "createdAt": ...,
  "lastUpdatedAt": ...,
  "email": ...,
  "name": ...,
  "fone": ...
}
```

#### Status codes
- [200](https://httpstatuses.com/200).
- [404](https://httpstatuses.com/404).

### POST /item/{email} - Replace the item with email
```http
  POST /item/{email}
```

The post method replaces the full item with was passed to the Json body.

Example:
```json
{
{
	"name": "much name! such easy! wow!"
}
}
```
:bangbang: It will leave all the other no programaticle columns empty.

Return the updated item:
```json
{
  "name": ...,
}
```
#### Status codes
- [200](https://httpstatuses.com/200).
- [404](https://httpstatuses.com/404).

## Todo
 
- [x]  Put the email as id.
- [x]  Validate email.
- [x]  Create the created at column.
- [x]  Create the last update at column.
- [x]  Create status column.
- [x]  Create an http patch method.
- [x]  Add correct http status to each method.
- [ ]  Create Search Methods Using Parameters.

## Changelog
### 1.2.0 27/08/2021
- Changed routes from item/items to lead/leads
- Added functions to handle Dynamo
- Added the customerAt column
- Removed the Post method
### 1.1.0 26/08/2021
- Email now is the primary key
- The methods now have their http status
- Added new columns
### 1.0.1 25/08/2021
- Changed the language of the project.
### 1.0.0 24/08/2021
- First version of the project with basic functionality.