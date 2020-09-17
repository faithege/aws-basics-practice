import AWS from 'aws-sdk'  // this sdk supports promises
import {handlePostRequest, handleGetRequest} from "./handlers"

const tablename = process.env.TABLE_NAME
const region = process.env.AWS_REGION
const documentClient = new AWS.DynamoDB.DocumentClient({'region': region})

// Importing aws-sdk using JS, believe document client needed for JS lambda writing
// Could hardcode the table name, but bettter practice to put in environment variables (this is automatically done for AWS_REGION, and ACCESS_KEY)
// Update expressions are used to update a particular attribute in an existing Item.
// Expression attribute values in Amazon DynamoDB are substitutes for the actual values that you want to compare—values that you might not know until runtime. An expression attribute value must begin with a colon (:) and be followed by one or more alphanumeric characters.
// Like SQL when you inject value later, in this case we want to use the step in the event payload object, if it doesn't exist we'll use 1 as the default
// Use ReturnValues if you want to get the item attributes as they appear before or after they are updated. For UpdateItem, the valid values are:
//             # NONE - If ReturnValues is not specified, or if its value is NONE, then nothing is returned. (This setting is the default for ReturnValues.)
//             # ALL_OLD - Returns all of the attributes of the item, as they appeared before the UpdateItem operation.
//             # UPDATED_OLD - Returns only the updated attributes, as they appeared before the UpdateItem operation.
//             # ALL_NEW - Returns all of the attributes of the item, as they appear after the UpdateItem operation.
//             # UPDATED_NEW - Returns only the updated attributes, as they appear after the UpdateItem operation.
// result is the returned proomised object (awaits until async function completed) - i promise rejected an exception is thrown
// NB 'context' parameter has info in it tthat we could find useful and extract, although in this example we don't need it

// This is an async function
exports.handler = async function(event, context) {
  //console.log(process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY, process.env.AWS_SESSION_TOKEN)
  console.log("Received event", JSON.stringify(event))

  const method = event.httpMethod
  console.log("method:", method)

  try {
    switch(method) {
      case "POST":
        return await handlePostRequest(documentClient, tablename, event) //we are awaiting as this parent function returns the promise returned my the db update method
      case "GET":
        return await handleGetRequest(documentClient, tablename) //likewise as above
      default:
        return {"statusCode": 405, "body": "Please update lambda to handle this method"}
    }
  }
  // catch/error action is the same for both post and get request so abstracted out to higherr level
  catch(error){
    console.log("error:", error)
    return {"statusCode": 503, "body": error}
    // error may not always have a statusCode or message so best not to extract them, instead give a generic code and print whole error
  }

}
