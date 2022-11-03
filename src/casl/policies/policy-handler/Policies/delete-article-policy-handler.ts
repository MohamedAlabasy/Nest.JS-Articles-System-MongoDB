import { Action } from "src/casl/action.enum";
import { AppAbility } from "src/casl/casl-ability.factory";
import { IPolicyHandler, PolicyHandler } from "../IPolicy-handler";
import { Article } from 'src/modules/articles/schema/articles.schema';

export class DeleteArticlePolicyHandler implements IPolicyHandler {
    handle(ability: AppAbility) {
        return ability.can(Action.Delete, Article);
    }
}