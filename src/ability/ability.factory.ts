import { InferSubjects, ExtractSubjectType, AbilityBuilder, Ability } from '@casl/ability';
import { Injectable } from '@nestjs/common'
import { User } from 'src/modules/users/schema/user.schema';

export enum Action {
    Mange = 'mange', // wildcard for any action
    Read = 'read',
}

export type Subject = InferSubjects<typeof User> | 'all' // all is a wildcard for any action
// export type Subject = InferSubjects<typeof User | typeof Post> | 'all'

export type AppAbility = Ability<[Action, Subject]> | 'all' // all is a wildcard for any action

@Injectable()
export class AbilityFactory {
    defineAbility(user: User) {
        // define the rules 
        const { can, cannot, build } = new AbilityBuilder(Ability)
        if (user.is_admin) {
            // builder.can(Action.Mange, 'all')
            can(Action.Read, User)
            // not equal
            // cannot(Action.Mange, User, { orgId: { $ne: user.orgId } }).because('u cant mange orgId')
        } else {
            cannot(Action.Read, User).because('you isn\'t an admin')
        }

        return build({
            detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subject>
        })
    }
}
