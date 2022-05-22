import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { ServerError } from '../../presentation/errors'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'

export class LogControllerDecorator implements Controller {
  constructor(
    private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.body instanceof ServerError) {
      await this.logErrorRepository.log(httpResponse.body.stack!)
    }
    return httpResponse
  }
}
