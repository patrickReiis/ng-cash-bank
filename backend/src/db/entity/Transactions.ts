import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Account } from './Account';

@Entity()
export class Transactions {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Account, (account) => account.id, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'debited_account_id' })
    debitedAccountId!: Account;

    @ManyToOne(() => Account, (account) => account.id, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'credited_account_id' })
    creditedAccountId!: Account;

    @Column('numeric')
    value!: number;

    @Column('timestamp')
    createdAt!: Date;
}
