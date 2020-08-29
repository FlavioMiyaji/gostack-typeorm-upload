import fs from 'fs';
import { getRepository } from 'typeorm';
import path from 'path';
import parse from 'csv-parse/lib/sync';

import uploadConfig from '../config/upload';
import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';
import CreateTransactionService from './CreateTransactionService';

interface Request {
  filename: string;
}

interface CsvTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute({ filename }: Request): Promise<Transaction[]> {
    const filePath = path.join(uploadConfig.diretory, filename);
    const fileExists = await fs.promises.stat(filePath);
    if (!fileExists) {
      throw new AppError(`File ${filename} not found!`);
    }

    const content = await fs.promises.readFile(filePath);
    const csvTransactions: CsvTransaction[] = parse(content, {
      columns: true,
      skip_empty_lines: true,
      ltrim: true,
    });

    const createTransaction = new CreateTransactionService();
    const transactions: Transaction[] = [];
    for (const { title, type, value, category } of csvTransactions) {
      const transaction = await createTransaction.execute({ title, type, value, category });
      transactions.push(transaction);
    }
    await fs.promises.unlink(filePath);
    return transactions;
  }
}

export default ImportTransactionsService;
