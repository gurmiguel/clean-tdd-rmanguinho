import { MongoClient } from 'mongodb'

export abstract class MongoHelper {
  private static client: MongoClient

  static async connect (uri: string) {
    MongoHelper.client = await MongoClient.connect(uri)
  }

  static async disconnect () {
    await MongoHelper.client.close()
  }
}
