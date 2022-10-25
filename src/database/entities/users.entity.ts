import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Articles } from './articles.entity';
import { Comments } from './comments.entity';
import { EmailVerification } from './email-verification.entity';
import { Likes } from './likes.entity';
import { ForgotPassword } from './forgot-password.entity';

@Entity({ name: 'users' })
export class Users {

    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ default: false })
    is_verification: boolean;

    @Column({ select: false })
    password: string;

    // for relations
    @OneToMany(() => Articles, (articles) => articles.user, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    articles: Articles[];

    @OneToMany(() => Comments, (comments) => comments.user, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    comments: Comments[];

    @OneToMany(() => Likes, (likes) => likes.user, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    likes: Likes[];

    @OneToMany(() => EmailVerification, (emailVerification) => emailVerification.user, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    emailVerification: EmailVerification[];

    @OneToMany(() => ForgotPassword, (forgotPassword) => forgotPassword.user, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    forgotPassword: ForgotPassword[];
}