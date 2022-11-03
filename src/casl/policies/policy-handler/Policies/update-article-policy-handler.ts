import { Action } from "src/casl/action.enum";
import { AppAbility } from "src/casl/casl-ability.factory";
import { Article } from "src/modules/articles/schema/articles.schema";
import { IPolicyHandler, PolicyHandler } from "../IPolicy-handler";

export class UpdateArticlePolicyHandler implements IPolicyHandler {
    handle(ability: AppAbility) {

        console.log('ability = ', ability.can(Action.Update, Article));

        return ability.can(Action.Update, Article);
    }
}