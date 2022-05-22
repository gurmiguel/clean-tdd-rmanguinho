import { Collection } from 'mongodb'
import { DocumentNotInsertedError } from '../errors/document-not-inserted-error'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

describe('Account Mongo Repository', () => {
  beforeAll(async() => {
    await MongoHelper.connect(process.env.MONGO_URL!)
  })

  afterAll(async() => {
    await MongoHelper.disconnect()
  })

  beforeEach(async() => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    const sut = new AccountMongoRepository()
    return sut
  }

  test('Should throw when mongodb can\'t insert account', async() => {
    jest.spyOn(Collection.prototype, 'findOne').mockResolvedValueOnce(null as never)
    const sut = makeSut()
    const accountData = {
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password',
    }
    const promise = sut.add(accountData)

    await expect(promise).rejects.toBeInstanceOf(DocumentNotInsertedError)

    jest.restoreAllMocks()
  })

  test('Should return an account on success', async() => {
    const sut = makeSut()
    const accountData = {
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password',
    }
    const account = await sut.add(accountData)

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(accountData.name)
    expect(account.email).toBe(accountData.email)
    expect(account.password).toBe(accountData.password)
  })
})
