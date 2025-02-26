import { Document } from 'mongoose';

export interface ICategory {
    name: string,
    description?: string
    imageUrl?: string
    sid?: string
}

export interface ICategoryDocument extends ICategory, Document {};

  