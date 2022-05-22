type UndefinedPropertyNames<D extends Record<string, any>> = {
  [K in keyof D]: D[K] extends undefined ? K : never
}[keyof D]

export function makeFakeObjectFactory<T extends Record<string, any>>(baseObject: T) {
  function make(): T
  function make<D extends Partial<T>>(data: D): Omit<T, UndefinedPropertyNames<D>>
  function make<D extends T>(data?: D) {
    const object = {
      ...baseObject,
      ...data,
    }

    for (const field in data) {
      const value = data[field]
      if (value === undefined) {
        delete object[field]
      }
    }

    return object
  }

  return make
}
