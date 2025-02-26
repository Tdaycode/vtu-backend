import { Document, FilterQuery, UpdateQuery, Model } from 'mongoose';
import { Service } from 'typedi';
import { BadRequestError } from '../utils/ApiError';

@Service()
export abstract class AbstractRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: any, session = null): Promise<T> {
    const sessionOption = session ? { session } : {};
    const doc = new this.model(data);
    return await doc.save(sessionOption);
  }

  async insertMany(data: any) {
    return await this.model.insertMany(data);
  }

  async find(filterQuery: FilterQuery<T>) {
    return this.model.find(filterQuery, {}, { lean: true });
  }

  async findById(id: string): Promise<T> {
    const document = await this.model.findOne({ _id: id });
    if(!document) throw new BadRequestError("Document not found");
    return document;
  } 

  async findOne(filter: FilterQuery<T>): Promise<T> {
    const document = await this.model.findOne(filter);
    if(!document) throw new BadRequestError("Document not found");
    return document;
  }

  async findSingle(filter: FilterQuery<T>): Promise<T | null> {
    const document = await this.model.findOne(filter);
    return document;
  }

  async updateOne(filter: FilterQuery<T>, data: UpdateQuery<T>, session = null): Promise<T> {
    const sessionOption = session ? { session } : {};
    const document = await this.model.findOneAndUpdate(filter, data, { new: true, lean: true, ...sessionOption });
    if(!document) throw new BadRequestError("Document not found");
    return document;
  }

  async findOneAndUpdate(filter: FilterQuery<T>, data: UpdateQuery<T>, options = {}): Promise<T> {
    const document = await this.model.findOneAndUpdate(filter, data, options);
    if(!document) throw new BadRequestError("Document not found");
    return document;
  }

  async findAndUpdate(filter: FilterQuery<T>, data: UpdateQuery<T>, options = {}) {
    const document = await this.model.updateOne(filter, data, options);
    return document;
  }
}
