import { Router } from 'itty-router'
import QrCode from './qrcode'
import UrlUUID from './url-uuid'

const router = Router()

router
  .options('/api/qrcode/', QrCode)
  .put('/api/qrcode/', QrCode)
  .get('/url-uuid/:id', UrlUUID)
  .get('*', () => new Response("Not found", { status: 404 }))

export const handleRequest = async (request: Request): Promise<Response> => await router.handle(request)
