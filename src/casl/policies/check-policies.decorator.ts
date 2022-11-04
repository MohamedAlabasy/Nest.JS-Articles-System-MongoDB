import { SetMetadata } from "@nestjs/common";
import { CHECK_POLICIES_KEY } from "src/config/policy";
// import { Context } from "vm";
import { PolicyHandler } from "./policy-handler/IPolicy-handler";


export const CheckPolicies = (/* cxt: Context, */ ...handlers: PolicyHandler[]) => SetMetadata(CHECK_POLICIES_KEY, handlers);