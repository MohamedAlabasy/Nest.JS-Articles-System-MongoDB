import { Action } from "src/casl/action.enum";
import { AppAbility } from "src/casl/casl-ability.factory";
import { User } from "src/modules/users/schema/user.schema";
import { IPolicyHandler, PolicyHandler } from "../IPolicy-handler";

export class ReadArticlePolicyHandler implements IPolicyHandler {
    handle(ability: AppAbility) {
        return ability.can(Action.Read, User);
    }
}