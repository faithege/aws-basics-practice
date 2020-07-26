#!/bin/bash
set -e # Good practice - ensures that if any errors received, script does not continue to run
export AWS_DEFAULT_PROFILE=cbf # Making sure I'm always using the right aws profile

# Declaring parameters that will be passed in when running the script
STACK=$1 
TEMPLATE=$2
PAYLOAD=$3 #the JSON object needs to be passed in with ''

# [] are called test if want look up commands/flags type man test
# essentially creating a custom error message if one of the three parameters are missing
# -o checks that file exists
# -r checks that file is readable
# -z checks that string exists
if [ -z "${STACK}" -o -z -r "${TEMPLATE}" -z "${PAYLOAD}"]
then
    echo "Usage: $0 <stack> <template-file> <payload>"
    exit 1
fi

# No need to use && as in a script we have set -e 
aws cloudformation deploy --template-file ${TEMPLATE} --stack-name ${STACK} --capabilities CAPABILITY_IAM 
# Here we are extracting the 'Function' resource from the stack so we don't need to hardcode it -> DYNAMIC ->use $(<command>) or will be read as a string!
# Destcribe-stack-resource returns a JSON which we interrogrape with jq to get the id we need
FUNCTION=$(aws cloudformation describe-stack-resource --stack-name ${STACK} --logical-resource-id Function | jq -r .StackResourceDetail.PhysicalResourceId)
aws lambda invoke --cli-binary-format raw-in-base64-out --log-type Tail --payload ${PAYLOAD} --function-name ${FUNCTION} output | jq -r .LogResult | base64 --decode
