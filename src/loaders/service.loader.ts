import AuthService from "@/services/auth.service";
import { Container } from "typedi";

export const authService = Container.get(AuthService);
