// import { KVNamespace } from '@cloudflare/workers-types'

declare const QRCODE: KVNamespace

enum QrCodeType {
  URL = 'url',
  SMS = 'sms',
  Email = 'email',
  Call = 'call',
  Contact = 'contact',
}

interface QrCode {
  id: string
  type: QrCodeType
}

const jsonResponse = (
  body: Record<string, unknown>,
  {
    headers = {
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*'
    },
    status = 200,
  } = {},
) => {

  headers['Access-Control-Allow-Origin'] = '*'
  headers['Access-Control-Allow-Methods'] = '*'
  headers['Access-Control-Allow-Headers'] = '*'
  return new Response(JSON.stringify(body), { headers, status })
}

const QrCode = async (request: Request): Promise<Response> => {
  try {
    const body = (await request.json()) as QrCode

    if (!body.id) {
      return jsonResponse({ message: `invalid id ${body.id}` }, { status: 400 })
    }

    const type = (body.type ?? 'invalid') as string
    if (type === 'invalid') {
      return jsonResponse(
        { message: `invalid type ${body.type}` },
        { status: 400 },
      )
    }

    await QRCODE.put(body.id, JSON.stringify(body))
  } catch (e) {
    console.error(e)
  }

  return jsonResponse({})
}

export default QrCode
