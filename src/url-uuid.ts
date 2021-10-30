// import { KVNamespace } from '@cloudflare/workers-types'
import { Request as IttyRequest } from 'itty-router'

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
      'Access-Control-Allow-Headers': '*',
    },
    status = 200,
  }: { headers?: { [key: string]: string }; status?: number } = {},
) => {
  headers['Access-Control-Allow-Origin'] = '*'
  headers['Access-Control-Allow-Methods'] = '*'
  headers['Access-Control-Allow-Headers'] = '*'
  return new Response(JSON.stringify(body), { headers, status })
}

const UrlUUID = async ({ params }: IttyRequest): Promise<Response> => {
  try {
    if (!params || !params.id) {
      return jsonResponse({ message: 'param not found' }, { status: 404 })
    }

    const tmp = await QRCODE.get(params.id)
    if (!tmp) {
      return jsonResponse({ message: 'code not found' }, { status: 404 })
    }

    const { url, type, callPhone } = JSON.parse(tmp)

    if (type === 'url') {
      return jsonResponse(
        {},
        {
          headers: {
            Location: url,
          },
          status: 302,
        },
      )
    }

    if (type === 'call') {
      return jsonResponse(
        {},
        {
          headers: {
            Location: `tele:${callPhone}`,
          },
          status: 302,
        },
      )
    }
  } catch (e) {
    console.error(e)
  }

  return jsonResponse({})
}

export default UrlUUID
