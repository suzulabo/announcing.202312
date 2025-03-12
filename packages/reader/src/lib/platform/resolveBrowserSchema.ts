import { getIOSBrowserSchema } from './localStorage'

// https://qiita.com/bontaro_1/items/ddb3eefa6e7f16b4597f
export const browserSchemas = [
  ['Safari', 'x-safari-https://@urlBase'],
  ['Chrome', 'googlechromes://@urlBase'],
  ['Firefox', 'firefox://open-url?url=@urlEncoded'],
  ['Edge', 'microsoft-edge-https://@urlBase'],
  ['Opera Touch', 'touch-https://@urlBase'],
  ['Opera Mini', 'opera-https://@urlBase'],
] as const

export function resolveBrowserSchema(url: string) {
  const schema = getIOSBrowserSchema()
  if (!schema) {
    return url
  }

  const urlBase = url.replace(new RegExp('^.+://'), '')
  const urlEncoded = encodeURIComponent(url)

  return schema.replace('@urlBase', urlBase).replace('@urlEncoded', urlEncoded)
}
