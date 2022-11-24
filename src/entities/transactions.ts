import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp } from 'typeorm'
import { Accounts } from './accounts';

@Entity()
export class Transactions {

    @PrimaryGeneratedColumn()
    id: number;


    @ManyToOne(() => Accounts, account => account.id)
    @JoinTable({
        name: 'accounts',
        joinColumn: {
            name: 'debitedAccount',
            referencedColumnName: 'id'
        }
    })
    debitedAccount: Accounts;

    @ManyToOne(() => Accounts, account => account.id)
    @JoinTable({
        name: 'accounts',
        joinColumn: {
            name: 'creditedAccount',
            referencedColumnName: 'id'
        }, inverseJoinColumn: {
            name: 'accountId',
            referencedColumnName: 'id'
        }
    })
    creditedAccount: Accounts;

    @Column({ type: 'decimal' })
    value: number;

    @Column({ type: 'timestamp with time zone' })
    @CreateDateColumn()
    createDate: Timestamp;
}