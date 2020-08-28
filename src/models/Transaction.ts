import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToMany, ManyToMany, OneToOne } from "typeorm";

import Category from "./Category";

@Entity('categories')
class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  type: 'income' | 'outcome';

  @Column()
  value: number;

  @Column()
  category_id: string;

  @OneToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column('timestamp with time zone')
  created_at: Date;

  @Column('timestamp with time zone')
  updated_at: Date;
}

export default Transaction;
