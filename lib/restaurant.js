const dynamo = require(`./dynamodb`);
const type = require(`./types.js`);

async function create(aItem) {
    try {
        let date = Math.floor(Date.now() / 1000);
        let item = {
            Type: type.type.restaurant,
            TypeSort:  `${type.type.restaurant}#${aItem.rfid}`,
            rfid: aItem.rfid,
            name: aItem.name,
            createdAt:  date,
            isActive: true,
            userid: aItem.rfid.split(' ').join('')
        }

        await dynamo.putItem(process.env.DYNAMO_TABLE_NAME, item);
        return item;
    } catch (error) {
        throw error;
    }
}

async function all() {
    try {
        const aKeyConditionExpression = `#Type = :type and begins_with(#TypeSort, :typeSort)`;
        const aExpressionAttributeNames = {
            '#Type': "Type",
            "#TypeSort": "TypeSort"
        };
        const aExpressionAttributeValues = {
            ":type": type.type.restaurant,
            ":typeSort": `${type.type.restaurant}#`
        };
        const aFilterExpression = `attribute_exists(isActive)`;

        return await dynamo.queryItem(process.env.DYNAMO_TABLE_NAME, 
            aKeyConditionExpression,
            aExpressionAttributeNames,
            aExpressionAttributeValues,
            aFilterExpression
        );
    } catch (e) {
        console.log(`Error getting all restaurants`, e);
        throw e;
    }
}

async function update(restaurant, aItem) {
    try {
        const aKey = {
            Type: type.type.restaurant,
            TypeSort: `${type.type.restaurant}#${aItem.restaurant}`
        };
        const aUpdateExpression = `set #active = :active`;
        const aExpressionAttributeNames = {
            '#active': 'isActive'
        };
        const aExpressionAttributeValues = {
            ":active": aItem.isActive
        }

        return await dynamo.updateItem(process.env.DYNAMO_TABLE_NAME, 
            aKey,
            aUpdateExpression,
            aExpressionAttributeNames,
            aExpressionAttributeValues
        );
    } catch (e) {
        console.log(`Error updating ${restaurant}`, e);
        throw e;
    }
}

module.exports = {
    all,
    create,
    update
};