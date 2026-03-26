/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Model, Types } from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { Logger, NotFoundException } from '@nestjs/common';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected readonly logger!: Logger;
  constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createdDocument.save()).toJSON() as unknown as TDocument;
  }

  async findOneByFilter(filter: Partial<TDocument>): Promise<TDocument> {
    const doc = await this.model.findOne(filter).lean<TDocument>(true);
    if (!doc) {
      this.logger.warn(
        `Document not found with filter: ${JSON.stringify(filter)}`,
      );
      throw new NotFoundException('Document not found');
    }
    return doc;
  }

  async findOneAndUpdate(
    filter: Partial<TDocument>,
    update: Partial<TDocument>,
  ): Promise<TDocument> {
    const doc = await this.model
      .findOneAndUpdate(filter, update, { new: true })
      .lean<TDocument>(true);
    if (!doc) {
      this.logger.warn(
        `Document not found with filter: ${JSON.stringify(filter)}`,
      );
      throw new NotFoundException('Document not found');
    }
    return doc;
  }
  async find(filter: Partial<TDocument>): Promise<TDocument[]> {
    return this.model.find(filter).lean<TDocument[]>(true);
  }

  async findOneAndDelete(filter: Partial<TDocument>): Promise<TDocument> {
    const doc = await this.model.findOneAndDelete(filter).lean<TDocument>(true);
    if (!doc) {
      this.logger.warn(
        `Document not found with filter: ${JSON.stringify(filter)}`,
      );
      throw new NotFoundException('Document not found');
    }
    return doc;
  }
}
