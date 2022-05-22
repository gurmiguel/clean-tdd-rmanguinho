import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { SignUpController } from './signup'
import { AccountModel, AddAccount, AddAccountModel, EmailValidator, HttpRequest } from './signup-protocols'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password',
})

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return makeFakeAccount()
    }
  }

  return new AddAccountStub()
}

interface SutTypes {
  sut: SignUpController
  emailValidator: EmailValidator
  addAccount: AddAccount
}

const makeSut = (): SutTypes => {
  const emailValidator = makeEmailValidator()
  const addAccount = makeAddAccount()
  const sut = new SignUpController(emailValidator, addAccount)

  return {
    sut,
    emailValidator,
    addAccount,
  }
}

const makeFakeRequest = (data?: Record<string, any>): HttpRequest => {
  const baseRequest = {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  }

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

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest({ name: undefined })
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
  })

  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest({ email: undefined })
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest({ password: undefined })
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should return 400 if no password confirmation is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest({ passwordConfirmation: undefined })
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
  })

  test('Should return 400 if no password confirmation fails', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest({ passwordConfirmation: 'invalid_password' })
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
  })

  test('Should return 400 if invalid email is provided', async () => {
    const { sut, emailValidator } = makeSut()
    jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)
    const httpRequest = makeFakeRequest({ email: 'invalid_email' })
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidator } = makeSut()
    const isValidSpy = jest.spyOn(emailValidator, 'isValid')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })

  test('Should return 500 if EmailValidator throws an exception', async () => {
    const { sut, emailValidator } = makeSut()
    jest.spyOn(emailValidator, 'isValid')
      .mockImplementation(() => {
        throw new Error()
      })
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError())
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccount } = makeSut()
    const accountAddSpy = jest.spyOn(addAccount, 'add')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(accountAddSpy).toHaveBeenCalledWith({
      name: httpRequest.body.name,
      email: httpRequest.body.email,
      password: httpRequest.body.password,
    })
  })

  test('Should return 500 if AddAccount throws an exception', async () => {
    const { sut, addAccount } = makeSut()
    jest.spyOn(addAccount, 'add')
      .mockImplementation(async () => {
        throw new Error()
      })
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError())
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })
})
