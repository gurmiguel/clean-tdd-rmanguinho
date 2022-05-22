import { MongoClient, Collection, Document, WithId } from 'mongodb'

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

  static map<Model>({ _id, ...document }: WithId<any>): Model {
    return {
      id: _id,
      ...document,
    }
  }
}
