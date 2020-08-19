#!/bin/bash
set -e 
export AWS_DEFAULT_PROFILE=cbf 
export AWS_PROFILE=cbf 

# Declaring parameters that will be passed in when running the script
STACK=$1 
TEMPLATE=$2
PAYLOAD=$3 #the JSON object needs to be passed in with ''

WORKDIR="../working"
mkdir -p ${WORKDIR}

if [ -z "${STACK}" -o ! -r "${TEMPLATE}" -o -z "${PAYLOAD}" ] 
then
    echo "Usage: $0 <stack> <template-file> <payload>"
    exit 1
fi

WORKING_TEMPLATE="${WORKDIR}/output-template.cfn.yaml"
BUCKET=cbf-faith-bucket
#For now this is a constant as we are using a proxy resource that takes ANY http method
URL="https://wkxkie4zsc.execute-api.eu-west-1.amazonaws.com/Alpha/test"
METHOD="GET"

# Repackage lambda and store in s3
aws cloudformation package --template-file ${TEMPLATE} --s3-bucket ${BUCKET} --output-template-file ${WORKING_TEMPLATE}
# Redeploy stack
aws cloudformation deploy --template-file ${WORKING_TEMPLATE} --stack-name ${STACK} --capabilities CAPABILITY_IAM
# Invoke lambda via api gateway (POST)
# curl -X ${METHOD} -d ${PAYLOAD} -i ${URL}
# Invoke lambda via api gateway (GET)
curl -X ${METHOD} -i ${URL}
# Outputs new line in terminal so prompt not on same line as previous result
echo -ne '\n'

#example of how to call> bash -x deploy-and-curl.sh cbf template.cfn.yaml '{"id":"liam"}'