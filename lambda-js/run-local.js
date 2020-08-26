process.env.AWS_PROFILE = 'cbf' // PROFILE for sdk (used by handler), need DEFAULT for cli
process.env.TABLE_NAME = 'cbf-Table-9D7EAURJPY2R'
process.env.AWS_REGION = 'eu-west-1'

const method = process.argv[2] //equivalent of $ in shell script, 2 is first argument in the array

const handler = require('./step-lambda.js').handler;

// const testGetEvent = {
//     httpMethod: method
// }

const testPostBody = {
    id: "Sally"
}

const testEvent = {
    httpMethod: method,
    body: JSON.stringify(testPostBody)
}

const promise = handler(testEvent)

promise.then(result => console.log(result))

//node run-local.js <method>