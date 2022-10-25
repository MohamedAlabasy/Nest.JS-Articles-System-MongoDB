import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Index } from 'typeorm';
import { Articles } from './articles.entity';
import { Users } from './users.entity';
import { EmojiType } from '../../utilities/common';


@Entity({ name: 'likes' })
export class Likes {

    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({
        type: "enum",
        enum: EmojiType,
        default: EmojiType.LIKE,
    })
    type: EmojiType;

    // for relations
    @ManyToOne(() => Users, (user) => user.likes, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    user: Users | number

    // @Index(["user", "article"], { unique: true })
    @ManyToOne(() => Articles, (article) => article.likes, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    article: Articles | number


}