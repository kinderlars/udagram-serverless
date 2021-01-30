import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import * as express from 'express'
import * as awsServerlessExpress from 'aws-serverless-express'

const XAWS = AWSXRay.captureAWS(AWS)

const docClient = new XAWS.DynamoDB.DocumentClient()

const groupsTable = process.env.GROUPS_TABLE

const app = express()

// Create Express server
const server = awsServerlessExpress.createServer(app)

// Pass API Gateway events to the Express server
exports.handler = (event, context) => { awsServerlessExpress.proxy(server, event, context) }


app.get('/groups', async (_req, res) => {
  const groups = await docClient.scan({
    TableName: groupsTable
  }).promise()

  const items = groups.Items
  res.json({
    items: items
  })
})

// Old implementation

// export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//   console.log('Processing event: ', event)
//   const result = await docClient.scan({
//     TableName: groupsTable
//   }).promise()
//
//   const items = result.Items
//
//   return {
//     statusCode: 200,
//     headers: {
//       'Access-Control-Allow-Origin': '*'
//     },
//     body: JSON.stringify({
//       items
//     })
//   }
// }
