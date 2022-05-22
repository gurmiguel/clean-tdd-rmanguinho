import { MongoClient, Collection, Document } from 'mongodb'

type WithoutId<Document> = Omit<Document, 'id'>

export abstract class MongoHelper {
  private static client: MongoClient

  static async connect (uri: string) {
    MongoHelper.client = await MongoClient.connect(uri)
  }

  static async disconnect () {
    await MongoHelper.client.close()
  }

  static getCollection<DocumentModel = Document> (name: string): Collection<WithoutId<DocumentModel>> {
    return MongoHelper.client.db().collection<WithoutId<DocumentModel>>(name)
  }
}
