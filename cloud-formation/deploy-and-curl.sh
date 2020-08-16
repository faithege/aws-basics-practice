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
METHOD="POST"

# Repackage lambda and store in s3
aws cloudformation package --template-file ${TEMPLATE} --s3-bucket ${BUCKET} --output-template-file ${WORKING_TEMPLATE}
# Redeploy stack
aws cloudformation deploy --template-file ${WORKING_TEMPLATE} --stack-name ${STACK} --capabilities CAPABILITY_IAM
# Invoke lambda via api gateway
curl -v -X ${METHOD} -d ${PAYLOAD} ${URL}

#example of how to call> bash -x deploy-and-curl.sh cbf template.cfn.yaml '{"id":"liam"}'