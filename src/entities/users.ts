import { BeforeInsert, Column, Entity, Generated, JoinColumn, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Accounts } from './accounts';
const bcrypt = require('bcryptjs');

@Entity()
export class Users {

  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;


  @OneToOne(() => Accounts, account => account.id)
  @JoinTable({
    name: 'accounts',
    joinColumn: {
      name: 'accountId',
      referencedColumnName: 'id'
    }
  })
  @Column({ type: 'integer', unique: true })
  @Generated()
  accountId: Accounts;

  @Column({ type: 'text', unique: true })
  username: string;

  @Column({ type: 'text' })
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12);
  }

  static async comparePasswords(
    candidatePassword: string,
    hashedPassword: string
  ) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}