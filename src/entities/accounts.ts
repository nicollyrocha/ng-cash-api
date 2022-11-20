import {Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm'
import { Transactions } from './transactions';
import { Users } from './users';

@Entity()
export class Accounts{

    @PrimaryGeneratedColumn()
    @OneToOne(()=>Users, user => user.accountId )
    @OneToMany(()=>Transactions, transaction => transaction.creditedAccount )
    @OneToMany(()=>Transactions, transaction => transaction.debitedAccount )
    id: number;

    @Column({type: 'decimal'})
    balance: number;
}