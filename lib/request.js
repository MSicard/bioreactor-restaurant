const response = require(`./response`);
const restaurant = require(`./restaurant`);
const container = require(`./container.js`);
const users = require(`./user`);


async function processGet(aGetEvent) {
    const resource = aGetEvent.resource.split(`/`).pop();
    
    if (resource == 'restaurant') {
        const responseBody = await restaurant.all();

        return response.buildSuccessResponse(`default`, responseBody);
    }

    if (resource == 'container') {
        const responseBody = await container.all();
        return response.buildSuccessResponse(`default`, responseBody);
    }

    if (resource == 'user') {
        const responseBody = await users.listUsers();
        return response.buildSuccessResponse(`default`, responseBody);
    }

    const error = new Error(`Resource name not found: ${resource}`);
    error.code = `resource_not_found`;
    throw error;
}

async function processPost(aPostEvent) {
    const resource = aPostEvent.resource.split(`/`).pop();
    const requestBody = JSON.parse(aPostEvent.body);
    const pathParameters = aPostEvent.pathParameters || {};

    if (resource == 'restaurant') {
        const responseBody = await restaurant.create(
            requestBody
        );
        
        return response.buildSuccessResponse(`default`, responseBody);
    }

    if (resource == '{restaurant}') {
        const responseBody = await restaurant.update(
            pathParameters.restaurant, requestBody
        );

        return response.buildSuccessResponse(`default`, responseBody);
    }

    if (resource == 'container') {
        const responseBody = await container.create(requestBody);
        return response.buildSuccessResponse(`default`, responseBody);
    }

    if (resource == '{container}') {
        const responseBody = await container.update(
            pathParameters.container, requestBody
        );
        return response.buildSuccessResponse(`default`, responseBody);
    }

    if (resource == 'user') {
        console.log(requestBody);
        const responseBody = await users.createUser(requestBody);
        return response.buildSuccessResponse(`default`, responseBody);
    }

    if (resource == '{user}') {
        const responseBody = await users.deleteUser(
            pathParameters.user
        );
        return response.buildSuccessResponse(`default`, responseBody);
    }

    const error = new Error(`Resource name not found: ${resource}`);
    error.code = `resource_not_found`;
    throw error;
}


module.exports = {
    processPost,
    processGet
};