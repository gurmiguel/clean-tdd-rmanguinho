import { HttpRequest } from '../presentation/protocols'

export const makeFakeRequestFactory = (baseRequest: Record<string, any>) => (data?: Record<string, any>): HttpRequest => {
  const request = {
    ...baseRequest,
    ...data,
  }

  for (const field in data) {
    const value = data[field]
    if (value === undefined) {
      delete request[field]
    }
  }

  return { body: request }
}
