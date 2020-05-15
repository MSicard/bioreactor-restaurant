const AWS = require(`aws-sdk`);

let dynamoClient;

function initDynamoClient() {
    if (typeof dynamoClient !== `undefined`) {
        return;
    }

    if (typeof process.env.DYNAMO_DB_REGION === `undefined`) {
        throw new Error(`error initializing dynamo client, missing configuration`);
    }
    dynamoClient = new AWS.DynamoDB.DocumentClient({
        region: process.env.DYNAMO_DB_REGION,
        apiVersion: `2012-08-10`
    });
}

async function putItem(aTableName, anItem) {
    try {
        initDynamoClient();
        return await dynamoClient.put({
            TableName: aTableName,
            Item: anItem
        }).promise();
    } catch (e) {
        console.log(`Error putting dynamo item ${JSON.stringify(anItem)}`, e);
        throw e;
    }
}

async function updateItem(aTableName,
    aKey, aUpdateExpression, aExpressionAttributeNames, aExpressionAttributeValues ) {
        try {
            initDynamoClient();
            return await dynamoClient.update({
                TableName: aTableName,
                Key: aKey,
                UpdateExpression: aUpdateExpression,
                ExpressionAttributeNames: aExpressionAttributeNames,
                ExpressionAttributeValues: aExpressionAttributeValues,
                ReturnValues: 'ALL_NEW'
            }).promise();
        } catch (e) {
            console.log(`Error updating dynamo item ${aKey} with ${JSON.stringify(aUpdateExpression)}`);
        }

}

async function queryItem(aTableName, 
        aKeyConditionExpression, 
        aExpressionAttributeNames,
        aExpressionAttributeValues,
        aFilterExpression) {
    try {
        initDynamoClient();
        const result = await dynamoClient.query({
            TableName: aTableName,
            KeyConditionExpression: aKeyConditionExpression, 
            ExpressionAttributeNames: aExpressionAttributeNames,
            ExpressionAttributeValues: aExpressionAttributeValues,
            FilterExpression: aFilterExpression
        }).promise();

        if (Object.keys(result).length === 0) {
            const error = new Error(`Item not found`);
            error.errorType = `resource_not_found`;
            throw error;
        }

        return result.Items;
    } catch (e) {
        console.log(`Error getting dynamo item ${JSON.stringify(aKeyConditionExpression)}`, e);
        throw e;
    }
}

async function getItem(aTableName, 
    aExpressionAttributeValues, 
    aExpressionAttributeNames, 
    aKeyConditionExpression) {
    try {
        initDynamoClient();
        const result = await dynamoClient.query({
            TableName: aTableName,
            ExpressionAttributeValues: aExpressionAttributeValues,
            ExpressionAttributeNames: aExpressionAttributeNames,
            KeyConditionExpression: aKeyConditionExpression,
        }).promise();

        if (Object.keys(result).length === 0) {
            const error = new Error(`Query not found`);
            error.errorType = `resource_not_found`;
            throw error;
        } 
        
        return result.Items;
    } catch (e) {
        console.log(`Error quering dynamo item ${JSON.stringify(aKeyConditionExpression)}`, e);
        throw e;
    }
}

module.exports = {
    putItem,
    getItem,
    queryItem,
    updateItem
}