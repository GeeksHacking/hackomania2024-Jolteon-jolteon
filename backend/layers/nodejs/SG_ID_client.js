const { SgidClient } = require("@opengovsg/sgid-client")

module.exports.initClient = (clientId, clientSecret, privateKey, redirectUri) => {

    return new SgidClient({
        clientId: clientId,
        clientSecret: clientSecret,
        privateKey: privateKey,
        redirectUri: redirectUri,
    })
}