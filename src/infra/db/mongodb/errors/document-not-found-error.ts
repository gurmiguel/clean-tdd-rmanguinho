import { Filter, Document } from 'mongodb'

export class DocumentNotFoundError extends Error {
  constructor (collectionName: string, filter: Filter<Document>) {
    super(`Document not found in collection '${collectionName}' with filters:\n${JSON.stringify(filter, null, 2)}`)
    this.name = DocumentNotFoundError.name
  }
}
