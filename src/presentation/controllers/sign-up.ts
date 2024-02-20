import {
  HttpRequest,
  HttpResponse,
  Controller,
  EmailValidator,
} from '@/presentation/protocols'

import { NoProvidedParamError, InvalidParamError } from '@/presentation/errors'

import { badRequest, internalServerError } from '@/presentation/helpers/http'

import { AddAccount } from '@/domain/usecases'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation',
      ]

      for (const field of requiredFields) {
        if (!httpRequest.body[field])
          return badRequest(new NoProvidedParamError(field))
      }

      const { password, passwordConfirmation, email, name } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isEmailValid = this.emailValidator.isValid(email)

      if (!isEmailValid) return badRequest(new InvalidParamError('email'))

      this.addAccount.execute({ email, password, name })
    } catch (error) {
      return internalServerError()
    }
  }
}
