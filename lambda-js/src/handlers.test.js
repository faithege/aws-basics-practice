const { dynamoScan } = require("./handlers");
const AWS = require("aws-sdk") // in package.json

describe('example test', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(1+2).toBe(3);
  });
});

describe('testing dynamoScan', () => {
  // Applies only to tests in this describe block
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

    ids.forEach(async (id) => {
      const insertDataParams = { TableName : tableName, Item: { Id: id} };
      await documentClient.put(insertDataParams).promise()
    });

    // ACT - run DynamoScan method
    const result = await dynamoScan(documentClient, dynamoScanRequest) //already returns a promise
    console.log(result)

    // ASSERT - verify DynamoScan has returned correct data - expect statements
    expect(result.length).toBe(3);
    expect(result).toEqual([{ Id: 'Tom' }, { Id: 'Michael' }, { Id: 'Peter' }])

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
});

