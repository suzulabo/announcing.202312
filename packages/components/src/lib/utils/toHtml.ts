import linkifyHtml from 'linkify-html'

export function toHtml(s: string) {
  return linkifyHtml(s, {
    defaultProtocol: 'https',
    target: '_blank',
    rel: 'nofollow noreferrer',
  })
}
