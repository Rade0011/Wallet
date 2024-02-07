import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CreateCategoryDto } from "../dto/create-category.dto";
import { User } from "src/user/entities/user.entity";
import { Transaction } from "src/transaction/entities/transaction.entity";

@Entity()
export class Category {
    @PrimaryGeneratedColumn({ name: 'category_id'})
    id: number;

    @Column()
    title: string;

    @CreateDateColumn()
    createdAt: Date;

    @CreateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Transaction, (transaction) => transaction.category)
    transactions: Transaction[];

    @ManyToOne(() => User, (user) => user.category)
    @JoinColumn({name: 'user_id'})
    user: User;
}
