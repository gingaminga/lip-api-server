import OAuthService from "@/services/oauth.service";
import UserService from "@/services/user.service";
import { Container } from "typedi";

export const oAuthService = Container.get(OAuthService);
export const userService = Container.get(UserService);
