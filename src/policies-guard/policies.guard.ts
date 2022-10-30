import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AppAbility, CaslAbilityFactory } from "src/casl/casl-ability.factory";
import { User } from "src/modules/users/schema/user.schema";
import { CHECK_POLICIES_KEY } from "./check-policies.decorator";
import { PolicyHandler } from "./policy-handler/IPolicy-handler";


@Injectable()
export class PoliciesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private caslAbilityFactory: CaslAbilityFactory,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const policyHandlers = this.reflector.get<PolicyHandler[]>(CHECK_POLICIES_KEY, context.getHandler(),) || [];

        // how to get user data ?
        // let { user } = context.switchToHttp().getRequest();
        // console.log(user);
        
        let user: User = {
            _id: "",
            name: "",
            email: "",
            is_admin: true,
            is_verification: false,
            password: ""
        }


        const ability = this.caslAbilityFactory.createForUser(user);

        return policyHandlers.every((handler) =>
            this.execPolicyHandler(handler, ability),
        );
    }

    private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
        if (typeof handler === 'function') {
            return handler(ability);
        }
        return handler.handle(ability);
    }
}