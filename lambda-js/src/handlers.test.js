const { dynamoScan } = require("./handlers");
const AWS = require("aws-sdk") // in package.json

// example test
test('adds 1 + 2 to equal 3', () => {
    expect(1+2).toBe(3);
  });

test('dynamoScan returns all data in a table', async () => {
    // region needs to match what's in docker compose
    const dynamoDbClient = new AWS.DynamoDB({'region': 'eu-west-1', 'endpoint': 'http://localhost:4566' })
    const documentClient = new AWS.DynamoDB.DocumentClient({'service': dynamoDbClient}) //sits on top od DDB client

    const tableName = "MockTable"
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

    try {

      // insert data
      const insertDataParams = {
        TableName : tableName,
        Item: {
          Id: 'Tom'
        }
      };

      await documentClient.put(insertDataParams).promise()

      // run DynamoScan method
      const request = {
        TableName: tableName,
        Limit: 5
    }

      const result = await dynamoScan(documentClient, request) //already returns a promise

      // verify DynamoScan has returned correct data - expect statements
      expect(result.length).toBe(1);
      //
    }
    finally {
      // Delete Table
      await dynamoDbClient.deleteTable({TableName : tableName}).promise()
    }

    
    // Other scenarios to test
    // update test above so we actually check data correct - testing base scan, update test name
    //separate test, works with no data - testing base scan
    //paginates correctly - above limit - as this is where recursion will kick in


});