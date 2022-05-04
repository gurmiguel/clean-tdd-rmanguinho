import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  },
}))

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
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_email@mail.com')

    expect(isValid).toBe(false)
  })

  test('Should return true if validator returns true', () => {
    const { sut } = makeSut()

    const isValid = sut.isValid('valid_email@mail.com')

    expect(isValid).toBe(true)
  })
})
