import AuthService from "@/services/auth.service";
import ToDoService from "@/services/todo.service";
import { Container } from "typedi";

export const authService = Container.get(AuthService);
export const todoService = Container.get(ToDoService);
