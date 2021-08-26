const AWS = require("aws-sdk")

const dynamo = new AWS.DynamoDB.DocumentClient()

exports.handler = async (event, context) => {
    let body
    let statusCode = 200
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    }
    
    try {
        switch (event.routeKey) {
            case "DELETE /items/{email}":
                await dynamo
                    .delete({
                        TableName: "http-crud-leads-items",
                        Key: {
                            email: event.pathParameters.email,
                        },
                    })
                    .promise()
                statusCode = 204
                body = null
                break
                
            case "GET /items/{email}":
                body = await dynamo
                    .get({
                        TableName: "http-crud-leads-items",
                        Key: {
                            email: event.pathParameters.email,
                        },
                    })
                    .promise()
                break

            case "GET /items":
                console.log(event.routeKey)
                console.log(event.body)
                console.log(event.queryStringParameters)
                body = await dynamo
                    .scan({ TableName: "http-crud-leads-items" })
                    .promise()
                break

            case "PUT /items":
                let requestJSON = JSON.parse(event.body)

                const Item = {
                    id: requestJSON.id,
                    name: requestJSON.name,
                    email: requestJSON.email,
                    fone: requestJSON.fone,
                }

                await dynamo
                    .put({
                        TableName: "http-crud-leads-items",
                        Item,
                    })
                    .promise()
                statusCode = 201
                body = Item
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
