import { EmailValidator } from '@/presentation/protocols'

export class EmailValidatorAdapter implements EmailValidator {
  isValid(email: string): boolean {
    console.log(email)
    return false
  }
}
