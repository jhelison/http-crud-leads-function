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
            case "DELETE /items/{id}":
                await dynamo
                    .delete({
                        TableName: "http-crud-leads-items",
                        Key: {
                            id: event.pathParameters.id,
                        },
                    })
                    .promise()
                body = `Deleted item ${event.pathParameters.id}`
                break
                
            case "GET /items/{id}":
                body = await dynamo
                    .get({
                        TableName: "http-crud-leads-items",
                        Key: {
                            id: event.pathParameters.id,
                        },
                    })
                    .promise()
                break

            case "GET /items":
                body = await dynamo
                    .scan({ TableName: "http-crud-leads-items" })
                    .promise()
                break

            case "PUT /items":
                let requestJSON = JSON.parse(event.body)
                await dynamo
                    .put({
                        TableName: "http-crud-leads-items",
                        Item: {
                            id: requestJSON.id,
                            name: requestJSON.name,
                            email: requestJSON.email,
                            fone: requestJSON.fone,
                        },
                    })
                    .promise()
                body = `Put item ${requestJSON.id}`
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
