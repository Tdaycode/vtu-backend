import Model from '../models/settings.model';
import { Service } from 'typedi';
import { ISettingsDocument } from '../interfaces/settings.interface';
import { AbstractRepository } from './abstract.repository';

@Service()
export default class SettingsRepository extends AbstractRepository<ISettingsDocument> {
  constructor() {
    super(Model);
  }
}
