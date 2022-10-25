import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Articles } from './articles.entity';
import { Users } from './users.entity';

@Entity({ name: 'comments' })
export class Comments {

    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column()
    comment: string;

    // for relations
    @ManyToOne(() => Users, (user) => user.comments, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    user: Users | number

    @ManyToOne(() => Articles, (article) => article.comments, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    article: Articles | number
}