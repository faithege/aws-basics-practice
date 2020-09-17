#!/bin/bash
set -e 

# Set env vars as we are running the lambda outside of the lambda environment
# If we export, it means the variable is available to sub-processes e.g. the docker run command
# We can do this as the docker run command has the ability to extract the values of these variables
# Alternatively, if you dont export then you need to use the = and substitute method =${}

export AWS_PROFILE='cbf'
export AWS_REGION='eu-west-1'
TABLE_NAME='cbf-Table-9D7EAURJPY2R'

METHOD=$1 

# We need these credentials as in the Docker env, it cannot access my credentials file
# $() means execute this command - so we set the return value from the command
export AWS_ACCESS_KEY_ID=$(aws configure get aws_access_key_id --profile ${AWS_PROFILE})
export AWS_SECRET_ACCESS_KEY=$(aws configure get aws_secret_access_key --profile ${AWS_PROFILE})


# This is an example of a heredoc
# We are piping to stdin of read command, which lets us set a variable
# look up read docs - read for linux, cat for mac
#read -r -d '' SCRIPT <<'EOF'
SCRIPT=$(cat <<EOF
const testPostBody = {
    id: "Sally"
}

// This is ignored if we use a GET request
const testEvent = { 
    httpMethod: "GET",
    body: JSON.stringify(testPostBody)
}
console.log(JSON.stringify(testEvent))
EOF
)
# hardcoded payload
# PAYLOAD='{"httpMethod":"POST","body":"{\"id\":\"Sally\"}"}'
# SCRIPT="const testPostBody = {id: 'Sally'}; const testEvent = { httpMethod: '${METHOD}', body: JSON.stringify(testPostBody)}; console.log(JSON.stringify(testEvent));"
PAYLOAD=$(node -e "${SCRIPT}") #-e allows above script to be evaluated by node, quotes preserve new lines in script

# \ allows multi-line commands, requires space before but none after
# -e is for environment variables, can either state specifically (as long as exported) or can use = to define
# -v is the path to the directory in which the lambda is in. NB - this image specifies that must use absolute path
# also specify runtime node version, and the optional elements of the specific lambda handler to trigger, and the event too trigger it with
docker run --rm \
  -e TABLE_NAME=${TABLE_NAME} \
  -e AWS_REGION \
  -e AWS_ACCESS_KEY_ID \
  -e AWS_SECRET_ACCESS_KEY \
  -v /Users/feg03/Documents/CBF/aws-basics-practice/lambda-js:/var/task:ro,delegated \
  lambci/lambda:nodejs12.x \
  step-lambda.handler ${PAYLOAD}
