// const handlePostRequest = async function(event) { << example of Functional Programming

//in newer JS can export functions/constants in the same file separately - we are able tto do this as we then transpile
export async function handlePostRequest(documentClient, tablename, event) {
  const body = JSON.parse(event.body) // converts a JSON string to a JSON object
  console.log("body:", JSON.stringify(body)) // when logging log the string version otherwise will just say Object

  const request = {
    TableName: tablename,
    Key:{
      'Id': body.id
    },
    UpdateExpression: "ADD SeenCount :step",
    ExpressionAttributeValues:{
      ':step': body.step || 1,
    },
    ReturnValues:"UPDATED_NEW"
  }
  console.log("Calling DDB", JSON.stringify(request))

  const result = await documentClient.update(request).promise()
  console.log("result:", result)
  return {"statusCode": 201, "body": JSON.stringify(result)}
  
}
  
export async function handleGetRequest(documentClient, tablename) {
  // nesting functions ok for recursive functions - moved out for testing purposes

  const request = {
    TableName: tablename,
    Limit: 5
  }
  console.log("Scanning DDB", JSON.stringify(request))

  const data = await dynamoScan(documentClient, request)
  // Code below will execute if promise resolves successfully, if want to respond to errors use try catch
  console.log("Scan succeeded.");
  data.map(item => console.log(item.Id + ": ",item.SeenCount)) // map better than for each
  return {"statusCode": 200, "body": JSON.stringify(data)} // body should be a string representation of the status code
}

export async function dynamoScan(documentClient, req, key, accumulator = []) { // default empty array used for base case
  console.log("Dynamo Scan", JSON.stringify(req), JSON.stringify(key), accumulator.length)
  // make a call to dynamo - adding the key to the request if it exists
  const data = await documentClient.scan({...req, ExclusiveStartKey: key}).promise()
  const newAccumulator = [...accumulator, ...data.Items]

  // are we done? if so return
  if (typeof data.LastEvaluatedKey == "undefined") { // base case
    return newAccumulator
  }
  // recurse if not done
  // to be able to keep going we need to pass in the LEK, and we need to amass the items
  else {
    return dynamoScan(documentClient, req,data.LastEvaluatedKey, newAccumulator)
  }
}
