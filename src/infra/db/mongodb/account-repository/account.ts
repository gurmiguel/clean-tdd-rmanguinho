import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { DocumentNotFoundError } from '../errors/document-not-found-error'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountsCollection = MongoHelper.getCollection<AccountModel>('accounts')

    const { insertedId } = await accountsCollection.insertOne(accountData)
    const findResult = await accountsCollection.findOne({ _id: insertedId })

    if (!findResult) {
      throw new DocumentNotFoundError(accountsCollection.collectionName, { _id: insertedId })
    }

    return MongoHelper.map<AccountModel>(findResult)
  }
}
