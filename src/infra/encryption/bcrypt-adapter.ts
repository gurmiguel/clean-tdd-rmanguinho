import bcrypt from 'bcrypt'
import { Encrypter } from '../../data/protocols/encrypter'

export class BcryptAdapter implements Encrypter {
  constructor (private readonly salt: string | number) {}

  async encrypt (value: string): Promise<string> {
    const hashedValue = await bcrypt.hash(value, 12)

    return hashedValue
  }
}
