import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Users } from './users.entity';

@Entity({ name: 'forgot_password' })
export class ForgotPassword {

    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column()
    code: string;

    @Column()
    created_at: Date;

    @Column()
    expire_at: Date;

    // for relations
    @ManyToOne(() => Users, (user) => user.forgotPassword, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    user: Users | number
}