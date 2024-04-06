const AWS = require("aws-sdk");
const ssm = new AWS.SSM({
    apiVersion: "2014-11-06"
});

module.exports = {
    async getParameterStoreValue(keyName) {
        const ssmParams = {
            Names: [
                keyName
            ],
            WithDecryption: true
        };
    
        let q = await ssm.getParameters(ssmParams).promise();
    
        if (q.Parameters.length == ssmParams.Names.length) {
            return q.Parameters.map((o) => {
                return o.Value;
            })[0]
        }
    
        return '';
    }
};