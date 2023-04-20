import OAuthService from "@/services/oauth.service";
import { Container } from "typedi";

export const oAuthService = Container.get(OAuthService);
