import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { DocumentNotInsertedError } from '../errors/document-not-inserted-error'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountsCollection = await MongoHelper.getCollection<AccountModel>('accounts')

    const { insertedId } = await accountsCollection.insertOne(accountData)
    const findResult = await accountsCollection.findOne({ _id: insertedId })

    if (!findResult) {
      throw new DocumentNotInsertedError(accountsCollection.collectionName, accountData)
    }

    return MongoHelper.map<AccountModel>(findResult)
  }
}
