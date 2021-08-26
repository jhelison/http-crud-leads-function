const AWS = require("aws-sdk")

const dynamo = new AWS.DynamoDB.DocumentClient()

exports.handler = async (event, context) => {
    let body = null
    let statusCode = 200
    let item
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    }

    try {
        switch (event.routeKey) {
            case "GET /items":
                body = await dynamo
                    .scan({ TableName: "http-crud-leads-items" })
                    .promise()
                break

            case "PUT /items":
                let requestJSON = JSON.parse(event.body)

                item = {
                    id: requestJSON.id,
                    name: requestJSON.name,
                    email: requestJSON.email,
                    fone: requestJSON.fone,
                }

                await dynamo
                    .put({
                        TableName: "http-crud-leads-items",
                        item,
                    })
                    .promise()
                statusCode = 201
                body = item
                break

            case "GET /item/{email}":
                item = await dynamo
                    .get({
                        TableName: "http-crud-leads-items",
                        Key: {
                            email: event.pathParameters.email,
                        },
                    })
                    .promise()

                if(Object.keys(item).length){
                    body = item
                }
                else{
                    statusCode = 404
                }
                break

            case "DELETE /item/{email}":
                item = await dynamo
                .get({
                    TableName: "http-crud-leads-items",
                    Key: {
                        email: event.pathParameters.email,
                    },
                })
                .promise()

                if(Object.keys(item).length){
                    await dynamo
                    .delete({
                        TableName: "http-crud-leads-items",
                        Key: {
                            email: event.pathParameters.email,
                        },
                    })
                    .promise()
                    statusCode = 204
                }
                else{
                    statusCode = 404
                }

                
                break

            case "PATCH /item/{email}":
                item = await dynamo
                    .get({
                        TableName: "http-crud-leads-items",
                        Key: {
                            email: event.pathParameters.email,
                        },
                    })
                    .promise()

                if(Object.keys(item).length){
                    const newItem = {...item.Item, ...JSON.parse(event.body)}

                    await dynamo
                    .put({
                        TableName: "http-crud-leads-items",
                        Item: newItem,
                    })
                    .promise()

                    statusCode = 200
                    body = newItem
                }
                else{
                    statusCode = 404
                }

                break

            default:
                throw new Error(`Unsupported route: "${event.routeKey}"`)
        }
    } catch (err) {
        statusCode = 400
        body = err.message
    } finally {
        body = JSON.stringify(body)
    }

    return {
        statusCode,
        body,
        headers,
    }
}
