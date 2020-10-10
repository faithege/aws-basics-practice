import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from "aws-lambda";
// const handlePostRequest = async function(event) { << example of Functional Programming
import { DocumentClient, ItemList, Key, ScanInput } from "aws-sdk/clients/dynamodb";

interface SeenEvent {
  id: string
  step?: number 
}

//in newer JS can export functions/constants in the same file separately - we are able tto do this as we then transpile
export async function handlePostRequest(documentClient: DocumentClient, tablename: string, event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResultV2> {
  if (!event.body) {
    console.log("Event body is undefined");
    return { statusCode: 400, body: `HTTP Body is missing, please add one for a POST request` }
  } 

  const body: SeenEvent = JSON.parse(event.body); // converts a JSON string to a JSON object
  console.log('body:', JSON.stringify(body)); // when logging log the string version otherwise will just say Object
  
  // 2 versions of UII one for DocumentClient and one for DynamoDb so make sure get right one
  const request: DocumentClient.UpdateItemInput = {
    TableName: tablename,
    Key: {
      Id: body.id,
    },
    UpdateExpression: 'ADD SeenCount :step',
    ExpressionAttributeValues: {
      ':step': body.step || 1,
    },
    ReturnValues: 'UPDATED_NEW',

  };
  console.log('Calling DDB', JSON.stringify(request));

  const result = await documentClient.update(request).promise();
  console.log('result:', result);
  return { statusCode: 201, body: JSON.stringify(result) };
}

export async function dynamoScan(documentClient: DocumentClient, req: ScanInput, key?: Key, accumulator: ItemList = []): Promise<ItemList> { // default empty array used for base case
  console.log('Dynamo Scan', JSON.stringify(req), JSON.stringify(key), accumulator.length);
  // make a call to dynamo - adding the key to the request if it exists
  const data = await documentClient.scan({ ...req, ExclusiveStartKey: key }).promise();

  // Hnadle side case by providing a default value of an empty array (iterable so can be handled by ...)
  const dataItems = data.Items || []
  const newAccumulator = [...accumulator, ...dataItems];

  // are we done? if so return
  if (typeof data.LastEvaluatedKey === 'undefined') { // base case
    return newAccumulator;
  }
  // recurse if not done
  // to be able to keep going we need to pass in the LEK, and we need to amass the items

  return dynamoScan(documentClient, req,data.LastEvaluatedKey, newAccumulator);
}

export async function handleGetRequest(documentClient: DocumentClient, tablename: string): Promise<APIGatewayProxyResultV2> {
  // nesting functions ok for recursive functions - moved out for testing purposes

  const request = {
    TableName: tablename,
    Limit: 5,
  };

  const data = await dynamoScan(documentClient, request);
  // Code below will execute if promise resolves successfully, if want to respond to errors use try catch
  console.log('Scan succeeded.');
  data.map(item => console.log(item.Id + ': ',item.SeenCount)); // map better than for each
  return { statusCode: 200, body: JSON.stringify(data) }; // body should be a string representation of the status code
}
