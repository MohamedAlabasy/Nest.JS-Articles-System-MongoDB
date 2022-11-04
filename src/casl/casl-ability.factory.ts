import { InferSubjects, ExtractSubjectType, AbilityBuilder, Ability, AbilityClass } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Action } from "./action.enum";
import { User } from 'src/users/schema/user.schema';
import { Article, ArticleDocument } from 'src/articles/schema/articles.schema';
import { Comment } from 'src/comments/schema/comments.schema';
import { Like } from 'src/likes/schema/likes.schema';

type Subjects = InferSubjects<typeof User | typeof Article | typeof Comment | typeof Like> | 'all';
// type Subjects = InferSubjects<typeof User> | 'all'; // all is a wildcard for any action

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
    // the key is to inject the cat model over nest js injection in the casl ability factory. So a factory like this should work:
    //   https://stackoverflow.com/questions/69381918/nestjs-casl-mongoose-casl-cannot-infer-subject-type-from-mongoose-schema
    constructor(
        @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
    ) { }

    createForUser(user: User) { //my fun
        const { can, cannot, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(Ability as AbilityClass<AppAbility>);

        // not equal
        // cannot(Action.Mange, User, { orgId: { $ne: user.orgId } }).because('u cant mange orgId')
        // if (user.is_admin) {
        //     can(Action.Read, User, { is_admin: { $ne: true } })
        // } else {
        //     cannot(Action.Read, User).because('you isn\'t an admin')
        // }

        //#region 
        // cannot(Action.Mange, User, { orgId: { $ne: user.orgId } }).because('u cant mange orgId')
        //#endregion

        //#region "articles"
        // can(Action.Update, this.articleModel, { 'user._id': user._id } as any)
        // can(Action.Delete, this.articleModel, { 'user._id': user._id } as any)
        can([Action.Update, Action.Delete], this.articleModel, { 'user._id': user._id } as any)
        //#endregion "articles"


        //#region "Comment"
        can([Action.Update, Action.Delete], Comment, { user })
        // cannot(Action.Delete, Article, { createdAt:10 })
        //#endregion "Comment"


        //#region "Comment"
        // can([Action.Update, Action.Delete], Like, { user })
        //#endregion "Comment"


        // can(Action.Update, Article, { user: { $ne: user._id } }).because('u cant mange orgId');
        // if (user) {
        //     // can(Action.Update, Article, { user: user._id });
        // } else {

        // }
        // can(Action.Update, Article, { authorId: user.id });
        // cannot(Action.Delete, Article, { isPublished: true });

        return build({
            // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
            detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
        });
    }
}
