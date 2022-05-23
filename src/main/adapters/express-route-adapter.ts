import { RequestHandler } from 'express'
import { Controller, HttpRequest } from '../../presentation/protocols'

export const adaptRoute = (controller: Controller): RequestHandler => {
  return async(req, res) => {
    const httpRequest: HttpRequest = {
      body: req.body,
    }
    const httpResponse = await controller.handle(httpRequest)

    if (httpResponse.body instanceof Error) {
      res.status(httpResponse.statusCode).send({ error: httpResponse.body.message })
    } else {
      res.status(httpResponse.statusCode).send(httpResponse.body)
    }
  }
}
