process.env.AWS_PROFILE = 'cbf' // PROFILE for aws-sdk (used by handler), need AWS_DEFAULT_PROFILE if doing the same thing in the cli
process.env.TABLE_NAME = 'cbf-Table-9D7EAURJPY2R'
process.env.AWS_REGION = 'eu-west-1'

const method = process.argv[2] //equivalent of $ in shell script, 2 is first argument in the array - see below for GET request
//element 0 is node version element 1 is file element 2 is first argument
console.log(process.argv)
// [
//     '/Users/feg03/.nvm/versions/node/v12.18.3/bin/node',
//     '/Users/feg03/Documents/CBF/aws-basics-practice/lambda-js/run-local.js',
//     'GET'
// ]

const handler = require('./step-lambda.js').handler; //we need the .handler for this to work! This is whatt is exported

const testPostBody = {
    id: "Sally"
}

// This is ignored if we use a GET request
const testEvent = { 
    httpMethod: method,
    body: JSON.stringify(testPostBody)
}

const promise = handler(testEvent)

promise.then(result => console.log(result))