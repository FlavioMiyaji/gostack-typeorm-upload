import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({ title, value, type, category: category_title }: Request): Promise<Transaction> {
    if (type === 'outcome') {
      const { total } = await new TransactionsRepository().getBalance();
      if ((total - value) <= 0) {
        throw new AppError('Not enough available income to create a new outcome transaction!');
      }
    }

    const categoryRepository = getRepository(Category);
    let category = await categoryRepository.findOne({
      where: { title: category_title }
    });
    if (!category) {
      category = await categoryRepository.create({
        title: category_title,
      });

      await categoryRepository.save(category);
    }

    const transactionRepository = getRepository(Transaction);
    const transaction = await transactionRepository.create({
      title,
      value,
      type,
      category_id: category.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
