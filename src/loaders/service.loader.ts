import AuthService from "@/services/auth.service";
import NotificationService from "@/services/notification.service";
import RoutineService from "@/services/routine.service";
import ToDoService from "@/services/todo.service";
import { Container } from "typedi";

export const authService = Container.get(AuthService);
export const notificationService = Container.get(NotificationService);
export const routineService = Container.get(RoutineService);
export const todoService = Container.get(ToDoService);
