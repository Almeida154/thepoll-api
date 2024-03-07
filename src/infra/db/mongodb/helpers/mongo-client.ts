import { setup, teardown } from 'vitest-mongodb'
import { MongoClient as Client, Collection, Db } from 'mongodb'

interface IConnectOptions {
  useMemory?: boolean
  url?: string
}

type Result<T> = T & { _id?: string }

export const MongoClient = {
  db: null as Db,
  client: null as Client,
  usingMemory: false,
  url: null as string,

  async connect(options?: IConnectOptions): Promise<void> {
    this.usingMemory = options?.useMemory
    this.url = options?.url

    options?.useMemory
      ? await this.connectToMemoryServer()
      : await this.connectToServer(options?.url)
  },

  async connectToServer(url: string): Promise<void> {
    this.client = await Client.connect(url)
  },

  async connectToMemoryServer(): Promise<void> {
    await setup()
    this.client = await Client.connect(globalThis.__MONGO_URI__)
  },

  async disconnect(): Promise<void> {
    this.usingMemory
      ? await this.disconnectFromMemoryServer()
      : await this.disconnectFromServer()
  },

  async disconnectFromServer() {
    await this.client?.close()
    this.client = null
  },

  async disconnectFromMemoryServer() {
    this.client = null
    await teardown()
  },

  async getCollection(name: string): Promise<Collection> {
    if (!this.client?.db()) {
      await this.connect({ useMemory: this.usingMemory, url: this.url })
    }

    return this.client.db().collection(name)
  },

  map<T>(resultItem: Partial<Result<T>>): T {
    const { _id, ...rest } = resultItem
    return { id: _id, ...rest } as T
  },
}
