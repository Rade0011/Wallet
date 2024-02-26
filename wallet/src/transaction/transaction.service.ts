import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    ){}

  async create(createTransactionDto: CreateTransactionDto, id: number) {
    if (!createTransactionDto) {
      throw new BadRequestException('Something wrong')
    }
    const transaction = {
      title: createTransactionDto.title,
      amount: createTransactionDto.amount,
      type: createTransactionDto.type,
      user: {id},
      category: { id: +createTransactionDto.category}
    }

    const savedTransaction = await this.transactionRepository.save(transaction)
    return savedTransaction
  }

  async findAll(id: number) {
    const transactions = await this.transactionRepository.find({
      where: {
        user: {id}
      },
      order: {
        createdAt: 'DESC'
      }
    })
    return transactions
  }

  async findOne(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: {
        id
      },
      relations: {
        user: true,
        category: true
      }
    })
    if (!transaction) {
      throw new BadRequestException('This Transaction not found ')
    }
    return transaction
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    try {
    await this.findTransaction(id)
    await this.transactionRepository.update(id, updateTransactionDto)
    return this.transactionRepository.findOne({
      where: {id}
    })
  } catch(error) {
    throw error
  }
  }

  async remove(id: number) {
    const transaction = await this.findTransaction(id);
    try {
      await this.transactionRepository.remove(transaction);
      return transaction
    } catch (error) {
      throw error;
    }
  }

  async findTransaction(id: number): Promise<Transaction> {
    try {
      const transaction = await this.transactionRepository.findOneOrFail({
        where: {id}
      });
      return transaction;
    } catch (error) {
      throw new BadRequestException('This transaction not found');
    }
  }

  async findAllWithPagination(id: number, page: number, limit: number) {
    console.log(id, page, limit)
    const transaction = await this.transactionRepository.find({
      where: {
        user: {id}
      },
      relations: {
        user: true,
        category: true
      },
      order: {
        createdAt: 'DESC'
      },
      take: limit,
      skip: (page - 1) * limit,
    })
    console.log(transaction)
    return transaction
  }
}
