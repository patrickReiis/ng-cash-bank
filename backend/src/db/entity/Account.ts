import { Column, Entity, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Account {

    @PrimaryGeneratedColumn()
    id!: number;

    // numeric datatype is slower compared to interger types
    // numeric datatype is good for monetary amounts since it has good precision
    /** PAY ATTENTION
     *
     * Floating-point numbers are tricky to use
     * If you want to ADD to or SUBTRACT from the balance use this formula:
     * ((balance * 100) ± (moneyNumber * 100)) / 100 
     * This formula prevents decimal numbers to have more than 2 digits
     */
    @Column('numeric', { default: 100 })
    balance!: number;
}
