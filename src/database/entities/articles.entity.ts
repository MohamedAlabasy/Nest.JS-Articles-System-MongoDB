import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Comments } from './comments.entity';
import { Likes } from './likes.entity';
import { Users } from './users.entity';

@Entity({ name: 'articles' })
export class Articles {

    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ unique: true })
    title: string;

    @Column()
    description: string;

    // for relations
    @ManyToOne(() => Users, (user) => user.articles, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    user: Users | number

    @OneToMany(() => Comments, (comments) => comments.article, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    comments: Comments[];

    @OneToMany(() => Likes, (likes) => likes.article, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    likes: Likes[];
}