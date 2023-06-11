import AuthService from "@/services/auth.service";
import UserService from "@/services/user.service";
import { Container } from "typedi";

export const authService = Container.get(AuthService);
export const userService = Container.get(UserService);
