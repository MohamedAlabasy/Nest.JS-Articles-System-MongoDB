import { InferSubjects, ExtractSubjectType, AbilityBuilder, Ability, AbilityClass } from '@casl/ability';
import { Injectable } from '@nestjs/common';

import { User } from "src/modules/users/schema/user.schema";
import { Action } from "./action.enum";

// type Subjects = InferSubjects<typeof Article | typeof User> | 'all';
type Subjects = InferSubjects<typeof User> | 'all'; // all is a wildcard for any action

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
    createForUser(user: User) { //my fun
        const { can, cannot, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(Ability as AbilityClass<AppAbility>);

        if (user.is_admin) {
            // builder.can(Action.Mange, 'all')
            // can(Action.Manage, 'all'); // read-write access to everything
            can(Action.Read, User)
            // not equal
            // cannot(Action.Mange, User, { orgId: { $ne: user.orgId } }).because('u cant mange orgId')
        } else {
            // can(Action.Read, 'all'); // read-only access to everything
            cannot(Action.Read, User).because('you isn\'t an admin')
        }

        // can(Action.Update, Article, { authorId: user.id });
        // cannot(Action.Delete, Article, { isPublished: true });

        return build({
            // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
            detectSubjectType: (item) =>
                item.constructor as ExtractSubjectType<Subjects>,
        });
    }
}