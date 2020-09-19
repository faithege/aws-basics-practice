#!/bin/bash
set -e 

# Reliably get the directory containing this script
export DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

METHOD=$1
export TABLE_NAME='test-table' 

SCRIPT=$(cat <<EOF
const testPostBody = {
    id: "Sally"
}

// This is ignored if we use a GET request
const testEvent = { 
    httpMethod: "${METHOD}",
    body: JSON.stringify(testPostBody)
}
console.log(JSON.stringify(testEvent))
EOF
)

export PAYLOAD=$(node -e "${SCRIPT}") #-e allows above script to be evaluated by node, quotes preserve new lines in script

(
  cd ${DIR}/../lambda-js
  # Use nvm to switch to the project's node version
  [ -s "${NVM_DIR}/nvm.sh" ] && source "${NVM_DIR}/nvm.sh"
  [ -s "$(brew --prefix nvm)/nvm.sh" ] && source "$(brew --prefix nvm)/nvm.sh"
  nvm use
  # compile
  npm run transpile
)

# creates local stack if not already up 
docker-compose up -d localstack

#create table
# list table then parse output, if exists dont run create-table
#  we're using || true because if the table already exists, this command will profuce an error
# using || is a shortcut as will continue as true=true (replace with a check to see if table exists)

# uses local host - from perspective of laptop not container
# this is the endpoint where we send our requests to aka from laptop bash script to dynamo container to tell to make a table
# sending stdout to /dev/null otherwise it prints the response of the table creation which you need to manually quit out of before rest of script will run

aws dynamodb create-table \
    --table-name TABLE_NAME \
    --attribute-definitions AttributeName=Id,AttributeType=S \
    --key-schema AttributeName=Id,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
    --endpoint-url http://localhost:4566 > /dev/null || true 


# uses local stack - called from lambda in container not from terminal
# docker containers exiist in their own network, if look up localstack will point to instance of localstack - specified in docker compose config
# then looks up local stack port 4566
# if used docker run wouldnt be able to resolve 
docker-compose run --rm \
  -e TABLE_NAME \
  -e AWS_REGION \
  -e ENDPOINT_URL=http://localstack:4566 \
  -e AWS_ACCESS_KEY_ID=hello \
  -e AWS_SECRET_ACCESS_KEY=hi \
  lambda step-lambda.handler ${PAYLOAD} # lambda references lambda in stack
  #dummy credentials required, get an error without them as the lambda looks for them
