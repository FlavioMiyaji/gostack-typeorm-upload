import { Router } from 'express';
import { getRepository } from 'typeorm';
import multer from 'multer';

import uploadConfig from '../config/upload';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import Transaction from '../models/Transaction';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  try {
    const transactions = await getRepository(Transaction).find();
    const balance = await new TransactionsRepository().getBalance();
    return response.json({
      transactions,
      balance,
    });
  } catch ({ message, statusCode = 400 }) {
    return response
      .status(statusCode)
      .json({ message, status: 'error' });
  }
});

transactionsRouter.post('/', async (request, response) => {
  try {
    const { title, value, type, category } = request.body;
    const createTransaction = new CreateTransactionService();
    const transaction = await createTransaction.execute({
      title,
      value,
      type,
      category_title: category,
    });
    return response.json(transaction);
  } catch ({ message, statusCode = 400 }) {
    return response
      .status(statusCode)
      .json({ message, status: 'error' });
  }
});

transactionsRouter.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const deleteTransaction = new DeleteTransactionService();
    await deleteTransaction.execute(id);
    return response.send();
  } catch ({ message, statusCode = 400 }) {
    return response
      .status(statusCode)
      .json({ message, status: 'error' });
  }
});

transactionsRouter.post('/import', upload.single('file'), async (request, response) => {
  try {
    const { filename } = request.file;
    const importTransactions = new ImportTransactionsService();
    const transactions = await importTransactions.execute({ filename });
    return response.json(transactions);
  } catch ({ message, statusCode = 400 }) {
    return response
      .status(statusCode)
      .json({ message, status: 'error' });
  }
});

export default transactionsRouter;
