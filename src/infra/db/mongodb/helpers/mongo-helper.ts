import { MongoClient, Collection, Document, WithId } from 'mongodb'

type WithoutId<Document> = Omit<Document, 'id'>

export abstract class MongoHelper {
  private static client: MongoClient | null
  private static uri: string

  static async connect (uri: string) {
    MongoHelper.uri = uri
    MongoHelper.client = await MongoClient.connect(uri)
  }

  static async disconnect () {
    await MongoHelper.client?.close()
    this.client = null
  }

  static async getCollection<DocumentModel = Document> (name: string): Promise<Collection<WithoutId<DocumentModel>>> {
    if (MongoHelper.client === null) {
      await this.connect(this.uri)
    }

    return MongoHelper.client!.db().collection<WithoutId<DocumentModel>>(name)
  }

  static map<Model>({ _id, ...document }: WithId<any>): Model {
    return {
      id: _id,
      ...document,
    }
  }
}
