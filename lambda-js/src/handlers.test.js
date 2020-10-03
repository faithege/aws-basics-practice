import { dynamoScan, handleGetRequest, handlePostRequest } from "./handlers" // const { dynamoScan } = require("./handlers");
import AWS from 'aws-sdk' // in package.json //const AWS = require("aws-sdk") 

const dynamoDbClient = new AWS.DynamoDB({'region': 'eu-west-1', 'endpoint': 'http://localhost:4566' }) // region needs to match what's in docker compose
const documentClient = new AWS.DynamoDB.DocumentClient({'service': dynamoDbClient}) //sits on top od DDB client
const tableName = "MockTable"
const dynamoScanRequest = { TableName: tableName, Limit: 2}

beforeEach(async () => {
  await createTestTable(dynamoDbClient,tableName)
  // remember to use await needed so we don't continue through the code before table has finished being made
});

afterEach(async () => {
  await dynamoDbClient.deleteTable({TableName : tableName}).promise()
});

describe('testing dynamoScan', () => {
  // Applies only to tests in this describe block
  
  test('dynamoScan returns all data in a table', async () => {
    
    // ARRANGE - insert data
    const insertDataParams = { TableName : tableName, Item: { Id: 'Tom'} };
    await documentClient.put(insertDataParams).promise()

    // ACT - run DynamoScan method
    const result = await dynamoScan(documentClient, dynamoScanRequest) //already returns a promise

    // ASSERT - verify DynamoScan has returned correct data - expect statements
    expect(result.length).toBe(1); //toBe used for primitives
    expect(result).toEqual([{ Id: 'Tom' }]) //toEqual used for objects

  });

  test('dynamoScan returns an empty array if the table is empty', async () => {

    // ACT - run DynamoScan method
    const result = await dynamoScan(documentClient, dynamoScanRequest)

    // ASSERT - verify DynamoScan has returned 0 data
    expect(result.length).toBe(0);

  });

  test('dynamoScan recurses correctly and returns all data, ', async () => {
    // Note that the tests above use minimal data, and are only testing the base scanning function of DynamoScan
    // To test the recursion we need to either  inset more data or reduce the scan Limit so that the dynamo response is paginated and recursion triggered

    // ARRANGE - insert data
    const ids = ['Tom', 'Michael', 'Peter']

    // ids.forEach((id) => {
    //   const item = { PutRequest: { Item: { Id: id} } };
    //  insertItems.push(item);
    // });

    const insertItems = ids.map( id => {
      //because I'm returning an object - curly brackets need to remain, otherwise one liners don't need {}, nor return statement
      return { PutRequest: { Item: { Id: id} } };
    })


    // tableName constant alone does not resolve on LHS, interpreted as string - therefore  use []
    const insertDataParams = { RequestItems: { [tableName] : insertItems }};
    await documentClient.batchWrite(insertDataParams).promise()

    // ACT - run DynamoScan method
    const result = await dynamoScan(documentClient, dynamoScanRequest) //already returns a promise

    // ASSERT - verify DynamoScan has returned correct data - expect statements
    expect(result.length).toBe(3);
    expect(result).toEqual([{ Id: 'Michael' }, { Id: 'Peter' }, { Id: 'Tom' }]) //results returned alphabetically

  });

});

describe('testing handleGetRequest', () => {

  test('returns a 200 response on success', async () => {
    
    // ACT 
    const result = await handleGetRequest(documentClient, tableName);

    // ASSERT 
    expect(result.statusCode).toBe(200); 
    expect(result.body).toEqual('[]') 

  });

  test('returns a rejected promise on failure', async () => {

    //ARRANGE
    const mockDocumentClient = {
      scan: () => {
        return {
          promise: jest.fn().mockRejectedValue('error')}
      }
    };

    
    // ACT - don't await, as it won't catch an exception
    const result = handleGetRequest(mockDocumentClient, tableName)
 
    // ASSERT 
    expect(result).rejects.toBe('error');

    //alternative with await - pass it a function, execution deferred until inside expect (if not it's run immediately)
    // we can't use awaits and expect to throw
    // expect( async () => { await handleGetRequest(mockDocumentClient, tableName)}).toThrow('error')

  });

});

describe('testing handleGetRequest', () => {
  const testPostBody = {
    id: "Test"
  }
  const testEvent = { 
      httpMethod: "POST",
      body: JSON.stringify(testPostBody)
  }

  test('returns a rejected promise on failure', async () => {

    //ARRANGE
    const mockDocumentClient = {
      update: () => {
        return {
          promise: jest.fn().mockRejectedValue('error')}
      }
    };

    // ACT
    const result = handlePostRequest(mockDocumentClient, tableName, testEvent)
 
    // ASSERT 
    expect(result).rejects.toBe('error');

  });

  // unit test for handle post - test that if fails returns a rejected promise? successful 201 with and without step on correct key - bit more logic

  test('returns a 201 response on success and that a default step of 1 is used for the specified ID', async () => {
    
    // ACT 
    const result = await handlePostRequest(documentClient, tableName, testEvent);

    // ASSERT 
    const expectedBody = { Attributes: { SeenCount: 1} }
    expect(result.statusCode).toBe(201); 
    expect(result.body).toEqual(JSON.stringify(expectedBody)) 

  });

  test('returns a 201 response on success and that the specified step is used for the specified ID', async () => {
    
    // ARRANGE
    testPostBody.step = 5;
    const testEvent2 = { 
      httpMethod: "POST",
      body: JSON.stringify(testPostBody)
  }

    // ACT 
    const result = await handlePostRequest(documentClient, tableName, testEvent2);

    // ASSERT 
    const expectedBody = { Attributes: { SeenCount: 5} }
    expect(result.statusCode).toBe(201); 
    expect(result.body).toEqual(JSON.stringify(expectedBody)) 

  });

});

async function createTestTable(dynamoDbClient,tableName) {
  const createTableParams = {
    AttributeDefinitions: [
       {
      AttributeName: "Id", 
      AttributeType: "S"
     }
    ], 
    KeySchema: [
       {
      AttributeName: "Id", 
      KeyType: "HASH"
     }
    ], 
    ProvisionedThroughput: {
     ReadCapacityUnits: 5, 
     WriteCapacityUnits: 5
    }, 
    TableName: tableName
   };

  // create table
  await dynamoDbClient.createTable(createTableParams).promise()
}

