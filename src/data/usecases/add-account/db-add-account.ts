import { AddAccountRepository } from '../../protocols/add-account-repository'
import { AccountModel, AddAccount, AddAccountModel, Encrypter } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository,
  ) {}

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await await this.encrypter.encrypt(accountData.password)
    await this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword,
    })
    return await Promise.resolve({
      ...accountData,
      id: 'valid_id',
    })
  }
}
