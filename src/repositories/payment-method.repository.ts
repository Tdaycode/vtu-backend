import { Service } from 'typedi';
import { AbstractRepository } from './abstract.repository';
import { IPaymentMethodDocument } from '../interfaces/payment.interface';
import PaymentMethod from '../models/payment-method.model';

@Service()
export default class PaymentMethodRepository extends AbstractRepository<IPaymentMethodDocument> {
  constructor() {
    super(PaymentMethod);
  }
}
