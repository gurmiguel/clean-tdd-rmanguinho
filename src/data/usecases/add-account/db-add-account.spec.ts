import { Encrypter } from '../protocols/encrypter'
import { DbAddAccount } from './db-add-account'

class EncrypterStub {
  async encrypt (value: string): Promise<string> {
    return await Promise.resolve('hashed_value')
  }
}
interface SutTypes {
  sut: DbAddAccount
  encrypterStub: EncrypterStub
}

const makeEncrypter = (): Encrypter => {
  const encrypter = new EncrypterStub()

  return encrypter
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const sut = new DbAddAccount(encrypterStub)

  return { sut, encrypterStub }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith(accountData.password)
  })
})
