import { Handler } from '@netlify/functions'
import { PrivyClient } from '@privy-io/privy-node'

export const handler: Handler = async (event, context) => {
  const { name = 'stranger' } = event.queryStringParameters


  const client = new PrivyClient(
    'clfjzbafx000hmp08r3l8mj7c',
    'ULxSa2Z7E45Q23Zbfp9LZh4JX8JeufkWNk3e3Rw5QYwDtGZL9eZymTNFY9JHzT5xzeZkoormARSGb5PoLvHpkE4'
  )

  console.log('client', client)

  const fields = await client.listFields()

  console.log('fields', fields)
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello, ${name}!`,
    }),
  }
}
