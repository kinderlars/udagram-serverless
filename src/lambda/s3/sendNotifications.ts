import { S3Event, S3Handler } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()

const connectionsTable = process.env.CONNECTIONS_TABLE
const stage = process.env.STAGE
const apiId = process.env.API_ID

const connectionParams = {
    apiVersion: "2018-11-29",
    endpoint: `${apiId}.execute-api-eu-central-1.amazonaws.com/${stage}`
}

export const handler: S3Handler = async (event: S3Event) => {
    for (const record of event.Records) {
        const key = record.s3.object.key
        console.log('Processing S3 item with key: ', key)
    }
}

async function sendMessageToClient(connectionId, payload) {
    try{
        console.log('Sending message to a connection', connectionId)
    }catch (e){
        console.log('Failed to send message', JSON.stringify(e))
    }
}