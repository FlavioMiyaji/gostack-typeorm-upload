import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  private sum(type: 'income' | 'outcome', transactions: Transaction[]): number {
    const list = transactions
      .filter(transaction => transaction.type == type);
    if (!list || !list.length) return 0.0;
    return list
      .map(({ value }) => value)
      .reduce((previous, current) => previous + current)
      ;
  }

  public async getBalance(): Promise<Balance> {
    const transactions = await getRepository(Transaction).find();
    const income = this.sum('income', transactions);
    const outcome = this.sum('outcome', transactions);
    return {
      income,
      outcome,
      total: income - outcome,
    };
  }
}

export default TransactionsRepository;
