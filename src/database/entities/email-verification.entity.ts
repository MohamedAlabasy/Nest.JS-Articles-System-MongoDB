import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Users } from './users.entity';

@Entity({ name: 'email_verification' })
export class EmailVerification {

    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column()
    code: string;

    @Column()
    created_at: Date;

    @Column()
    expire_at: Date;

    // for relations
    @ManyToOne(() => Users, (user) => user.emailVerification, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    user: Users | number
}