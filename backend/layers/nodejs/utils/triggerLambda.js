let aws = require('aws-sdk');
let lambda = new aws.Lambda({
    region: 'ap-southeast-1'
});


module.exports.triggerLambda = (lambdaName, invocation, payload) => {

    return lambda.invoke({
        FunctionName: lambdaName,
        InvocationType: invocation != undefined ? invocation : 'RequestResponse',
        LogType: 'None',
        Payload: JSON.stringify(payload)

    }).promise()

}

