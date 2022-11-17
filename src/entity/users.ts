import {Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm'
import { Accounts } from './accounts';

@Entity()
export class Users{

    @PrimaryGeneratedColumn()
    id: number;


    @OneToOne(()=>Accounts, account => account.id)
    @JoinTable({name:'accounts',
    joinColumn:{
        name: 'accountId',
        referencedColumnName: 'id'
    }, inverseJoinColumn: {
        name: 'accountId',
        referencedColumnName: 'id'
    }
})
    accountId: Accounts;

    @Column({type:'text'})
    username: string;

    @Column({type:'text'})
    password: string;
}