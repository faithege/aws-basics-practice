#!/bin/bash
set -e 

# Reliably get the directory containing this script, rather than hardcode
export DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

CONTAINER='localstack'

# Use $() when need a piece of code to be evaluated before the rest oof the line is read -> not needed here
if docker ps | grep -q ${CONTAINER}
then 
    echo "LocalStack is already running"
else
    echo "LocalStack not currently running, setting up now"
    cd ../scripts/
    docker-compose up -d localstack
    cd ../lambda-js/
fi

