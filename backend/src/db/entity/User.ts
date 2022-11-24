import { Column, Entity, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { usernameMaxLength } from '../../users/register/validation';
import { Account } from '../entity/Account';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('varchar', { length: usernameMaxLength, unique: true })
    username!: string;

    // it's very likely that the password length will NOT be greater than 500 because I will store the hashed password
    @Column('varchar', { length: 500 }) 
    password!: string;

    @OneToOne(() => Account, { onDelete: 'CASCADE', cascade: ['insert']})
    @JoinColumn({ name: 'account_id' })
    account!: Account

    // the purpose of this is to 'use relation id without joining relation'
    @Column('int', { nullable: true })
    account_id!: number
}
