import { ValidationOptions, registerDecorator, ValidationArguments } from 'class-validator';
import iso3311a2 from 'iso-3166-1-alpha-2';

export function IsValidCountryCode(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      name: 'isValidCountryCode',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }

          if(value === "GLC") return true;

          const country = iso3311a2.getCountry(value) 
          const result = country ? true : false;
          return result;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.value} is not a valid country code`;
        },
      },
    });
  };
}
