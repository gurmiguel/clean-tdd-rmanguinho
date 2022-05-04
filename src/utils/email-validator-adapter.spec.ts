import { EmailValidatorAdapter } from './email-validator-adapter'

describe('EmailValidator Adapter', () => {
  interface SutTypes {
    sut: EmailValidatorAdapter
  }

  const makeSut = (): SutTypes => {
    const sut = new EmailValidatorAdapter()

    return {
      sut,
    }
  }

  test('Should return false if validator returns false', () => {
    const { sut } = makeSut()

    const isValid = sut.isValid('invalid_email@mail.com')

    expect(isValid).toBe(false)
  })
})
