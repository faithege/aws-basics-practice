# aws-basics-practice
Learning the basics of CloudFormation, Lambda, API Gateway, Bash and Docker

### CloudFormation
- Created a CloudFormation Template File which creates an AWS stack consisting of a Lambda Function, DynamoDB Table, and S3 bucket
- Two template files have been created, one in which the lambda was written in JS (`cbf`), and a second which was written in Python (`cbf-python`)

### Lambda
- Basic lambda created both in JS and python which adds an id to a DynamoDb and adds a specified number to the id's "SeenCount"
- Also added a `run-local` JS script which allows a lambda to be run locally instead of redeploying and invoking the CloudFormation stack

### Bash
- `deploy-and-invoke` - Basic script created which deploys a stack and invokes the stack function. This is useful when a change has been made to the stack template,
and then subsequently checking that the Lambda function is working as expected.
-This script can be invoked using
```./deploy-and-invoke.sh <stack-name> <template-file-name> '<payload>'```
- `deploy-and-curl` - Basic script created which deploys a stack and invokes the lambda via the API gateway.
-This script can be invoked using
```./deploy-and-curl.sh <stack-name> <template-file-name> <method> '<payload>'```
- `run-in-docker` - Basic script created which runs the step-lambda within a Docker Container (so you don't have to re-deploy the CloudFormation stack each time you make a modification to the lambda)
```./run-in-docker.sh```

## Running the App
Coming Soon

## Tech Stack
Coming Soon
