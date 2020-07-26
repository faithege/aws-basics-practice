# aws-basics-practice
Learning the basics of CloudFormation, Lambda, API Gateway and Bash

### CloudFormation
- Created a CloudFormation Template File which creates an AWS stack consisting of a Lambda Function, DynamoDB Table, and S3 bucket
- Two template files have been created, one in which the lambda was written in JS (`cbf`), and a second which was written in Python (`cbf-python`)

### Lambda
- Basic lambda created both in JS and python which adds an id to a DynamoDb and adds a specified number to the id's "SeenCount"

### Bash
- Basic script created which deploys a stack and invokes the stack function. This is useful when a change has been made to the stack template,
and then subsequently checking that the Lambda function is working as expected.
-This script can be invoked using
```./deploy-and-invoke.sh <stack-name> <template-file-name> '<payload>'```

## Running the App
Coming Soon

## Tech Stack
Coming Soon
