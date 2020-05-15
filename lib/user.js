const cognito = require(`./cognito`);

async function listUsers() {
    try {
        return await cognito.listUserClients(process.env.COGNITO_USER_POOL_ID);
    } catch (e) {
        console.log(`Error getting all clients`, e);
        throw e;
    }
}

async function createUser(aItem) {
    try {
        return await cognito.createUser(aItem.name, process.env.COGNITO_USER_POOL_ID, aItem.email);
    } catch (e) {
        console.log(`Error creating the ${aItem.name}`, e);
        throw e;
    }
}

async function deleteUser(username) {
    try {
        return await cognito.deleteUser(username, process.env.COGNITO_USER_POOL_ID);
    } catch (e) {
        console.log(`Error deleting ${username}`, e);
        throw e;
    }
}
module.exports = {
    listUsers,
    createUser,
    deleteUser
}