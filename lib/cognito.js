const AWS = require(`aws-sdk`);

let cognitoService;

function initCognitoService() {
    if (typeof cognitoService !== `undefined`) {
        return;
    }

    cognitoService = new AWS.CognitoIdentityServiceProvider({
        apiVersion: '2016-04-18'
    });
}

async function listUserClients(aUserPoolId) {
    try {
        initCognitoService();
        
        let users = await cognitoService.listUsers({
            UserPoolId: aUserPoolId,
            AttributesToGet: [
                'email'
            ]
        }).promise();

        return users['Users'];
    } catch (e) {
        console.log(`Error getting cognito users in user pool ${JSON.stringify(aUserPoolId)}`, e);
        throw e;
    }
}

async function createUser(aUsername, aUserPoolId, aUserEmail) {
    try {
        initCognitoService();
        let user = await cognitoService.adminCreateUser({ 
            Username: aUsername, 
            UserPoolId: aUserPoolId,
            DesiredDeliveryMediums: ['EMAIL'],
            UserAttributes: [
                { Name: 'email', Value: aUserEmail }
            ]
        }).promise();
        console.log(user);
        return user['User'];

    } catch (e) {
        console.log(`Error creating user ${aUsername}`, e);
        throw e;
    }
}

async function deleteUser(aUsername, aUserPoolId) {
    try {
        initCognitoService();
        return await cognitoService.adminDeleteUser({
            UserPoolId: aUserPoolId,
            Username: aUsername
        }).promise();
    } catch (e) {
        console.log(`Error deleting user ${aUsername}`, e);
        throw e;
    }
}


module.exports = {
    listUserClients,
    createUser,
    deleteUser
}
