const AWS = require("aws-sdk")

const dynamo = new AWS.DynamoDB.DocumentClient()

const TABLENAME = "http-crud-leads-items"

const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/
    return re.test(email)
}

const getDynamoItem = async (email) => {
    return await dynamo
        .get({
            TableName: TABLENAME,
            Key: {
                email,
            },
        })
        .promise()
}

const putDynamoItem = async (Item) => {
    await dynamo
        .put({
            TableName: TABLENAME,
            Item,
        })
        .promise()
}

const deleteDynamoItem = async (email) => {
    await dynamo
    .delete({
        TableName: TABLENAME,
        Key: {
            email,
        },
    })
    .promise()
}

const getAllDynamoItems = async () => {
    return await dynamo
    .scan({ TableName: TABLENAME })
    .promise()
}

exports.handler = async (event, context) => {
    let body = null
    let statusCode = 200
    let Item
    let requestJSON
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    }

    try {
        switch (event.routeKey) {
            case "GET /leads":
                body = await getAllDynamoItems()
                break

            case "PUT /leads":
                requestJSON = JSON.parse(event.body)
                if (requestJSON.email) {
                    if (!validateEmail(requestJSON.email)) {
                        body = {
                            error: "the email need to be correctly formated",
                        }
                        statusCode = 400
                        break
                    }

                    Item = await getDynamoItem(requestJSON.email)

                    if (Object.keys(Item).length) {
                        body = {
                            error: "the email is already registered",
                        }
                        statusCode = 409
                        break
                    }

                    Item = {
                        email: requestJSON.email,
                        name: requestJSON.name,
                        fone: requestJSON.fone,
                        createdAt: Date.now(),
                        status: "prospect",
                        lastUpdatedAt: Date.now(),
                    }

                    await putDynamoItem(Item)

                    statusCode = 201
                    body = Item
                    break
                }
                body = {
                    error: "missing the primary key email",
                }
                statusCode = 400
                break

            case "GET /lead/{email}":
                body = await getDynamoItem(event.pathParameters.email)

                if (!Object.keys(body).length) {
                    statusCode = 404
                }
                break

            case "DELETE /lead/{email}":
                Item = await getDynamoItem(event.pathParameters.email)

                if (Object.keys(Item).length) {
                    await deleteDynamoItem(event.pathParameters.email)
                    statusCode = 204
                } else {
                    statusCode = 404
                }

                break

            case "PATCH /lead/{email}":
                requestJSON = JSON.parse(event.body)
                Item = await getDynamoItem(event.pathParameters.email)

                if (Object.keys(Item).length) {
                    const newItem = {
                        ...Item.Item,
                        ...JSON.parse(event.body),
                        lastUpdatedAt: Date.now(),
                    }

                    await putDynamoItem(newItem)

                    statusCode = 200
                    body = newItem
                } else {
                    statusCode = 404
                }

                break

            case "POST /lead/{email}":
                requestJSON = JSON.parse(event.body)
                Item = await getDynamoItem(event.pathParameters.email)

                if (Object.keys(Item).length) {
                    Item = {
                        email: requestJSON.email || event.pathParameters.email,
                        name: requestJSON.name,
                        fone: requestJSON.fone,
                        status: requestJSON.status,
                        lastUpdatedAt: Date.now(),
                    }

                    await putDynamoItem(Item)

                    statusCode = 200
                    body = Item
                } else {
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
