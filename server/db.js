import AWS from "aws-sdk";

AWS.config.update({
  region: "eu-north-1", // your AWS region
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Create user in "information" table
async function createUser(user) {
  const params = {
    TableName: "information",
    Item: user
  };
  return dynamoDB.put(params).promise();
}

// Get user from "information" table by partition key "name"
async function getUser(name) {
  const params = {
    TableName: "information",
    Key: { name } // use the partition key
  };
  return dynamoDB.get(params).promise();
}

export { createUser, getUser };
