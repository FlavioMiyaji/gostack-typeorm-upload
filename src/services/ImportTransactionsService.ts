import fs from 'fs';
import { getRepository } from 'typeorm';
import path from 'path';
import parse from 'csv-parse/lib/sync';

import uploadConfig from '../config/upload';
import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';

interface Request {
  filename: string;
}

class ImportTransactionsService {
  async execute({ filename }: Request): Promise<Transaction[]> {
    const filePath = path.join(uploadConfig.diretory, filename);
    const fileExists = await fs.promises.stat(filePath);
    if (!fileExists) {
      throw new AppError(`File ${filename} not found!`);
    }

    const content = await fs.promises.readFile(filePath);
    const transactions: Transaction[] = parse(content, {
      columns: true,
      skip_empty_lines: true,
      ltrim: true,
    });

    const transactionRepository = getRepository(Transaction);
    for (const transaction of transactions) {
      const entity = transactionRepository.create(transaction);
      await transactionRepository.insert(entity)
      console.log(entity);
    }
    await fs.promises.unlink(filePath);
    return transactions;
  }
}

export default ImportTransactionsService;
