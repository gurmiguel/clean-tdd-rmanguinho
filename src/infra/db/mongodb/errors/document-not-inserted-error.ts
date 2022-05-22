import { Document } from 'mongodb'

export class DocumentNotInsertedError extends Error {
  constructor(collectionName: string, documentData: Document) {
    super(`Cannot insert document into collection '${collectionName}' with values:\n${JSON.stringify(documentData)}`)
    this.name = DocumentNotInsertedError.name
  }
}
