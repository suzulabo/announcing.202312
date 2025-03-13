const regex = /^\\d{4,8}$/

export function match(param: string) {
  return param.match(regex) !== null
}
