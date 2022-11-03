import { InferSubjects, ExtractSubjectType, AbilityBuilder, Ability, AbilityClass } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Action } from "./action.enum";

import { User } from "src/modules/users/schema/user.schema";
import { Article } from 'src/modules/articles/schema/articles.schema';
import { Like } from 'src/modules/likes/schema/likes.schema';
import { Comment } from 'src/modules/comments/schema/comments.schema';

type Subjects = InferSubjects<typeof User | typeof Article | typeof Comment | typeof Like> | 'all';
// type Subjects = InferSubjects<typeof User> | 'all'; // all is a wildcard for any action

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
    createForUser(user: User) { //my fun
        const { can, cannot, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(Ability as AbilityClass<AppAbility>);

        // not equal
        // cannot(Action.Mange, User, { orgId: { $ne: user.orgId } }).because('u cant mange orgId')
        if (user.is_admin) {
            can(Action.Read, User, { is_admin: { $ne: true } })
        } else {
            cannot(Action.Read, User).because('you isn\'t an admin')
        }

        //#region "articles"
        can(Action.Update, Article, { user })
        can(Action.Delete, Article, { user })
        // can([Action.Update, Action.Delete], Article, { user: currentLoggingUser })
        //#endregion "articles"

        //#region "Comment"
        // cannot(Action.Delete, Article, { createdAt:10 })
        can([Action.Update, Action.Delete], Comment, { user })
        //#endregion "Comment"

        //#region "Comment"
        can([Action.Update, Action.Delete], Like, { user })
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
            detectSubjectType: (item) =>
                item.constructor as ExtractSubjectType<Subjects>,
        });
    }
}