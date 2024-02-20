import { AccountModel } from '@/domain/models'

export interface AddAccountModel {
  name: string
  email: string
  password: string
}

export interface AddAccount {
  execute(account: AddAccountModel): Promise<AccountModel>
}
