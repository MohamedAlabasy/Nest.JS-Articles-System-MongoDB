import { InferSubjects, ExtractSubjectType, AbilityBuilder, Ability, AbilityClass } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Action } from "./action.enum";
import { User } from 'src/users/schema/user.schema';
import { Article, ArticleDocument } from 'src/articles/schema/articles.schema';
import { Comment, CommentDocument } from 'src/comments/schema/comments.schema';
import { Like, LikeDocument } from 'src/likes/schema/likes.schema';

type Subjects = InferSubjects<typeof User | typeof Article | typeof Comment | typeof Like> | 'all';  // all is a wildcard for any action

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
    // the key is to inject the cat model over nest js injection in the casl ability factory. So a factory like this should work:
    //   https://stackoverflow.com/questions/69381918/nestjs-casl-mongoose-casl-cannot-infer-subject-type-from-mongoose-schema
    constructor(
        @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
        @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
        @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
    ) { }

    createForUser(user: User) { //my fun
        const { can, cannot, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(Ability as AbilityClass<AppAbility>);

        //#region "articles"
        // can(Action.Update, this.articleModel, { 'user._id': user._id } as any)
        // can(Action.Delete, this.articleModel, { 'user._id': user._id } as any)
        can([Action.Update, Action.Delete], this.articleModel, { 'user._id': user._id } as any)
        //#endregion "articles"


        //#region "comment"
        can(Action.Update, this.commentModel, { 'user._id': user._id } as any)
        can(Action.Delete, this.commentModel, { 'user._id': user._id, createdAt: { $lt: new Date().getDate() + 7 } } as any)
        //#endregion "comment"


        //#region "like"
        can(Action.Update, this.likeModel, { user: user._id })
        can(Action.Delete, this.likeModel, { user: user._id, createdAt: { $lt: new Date().getDate() + 7 } } as any)
        //#endregion "like"


        return build({
            // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
            detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
        });
    }
}
