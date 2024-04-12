import { IValidation } from '../../../protocols/validation'

export class ValidationComposite implements IValidation {
  constructor(private readonly validations: IValidation[]) {}

  validate(input: unknown): Error {
    for (const validation of this.validations) {
      const error = validation.validate(input)
      if (error) return error
    }
  }
}
