import { startRedis } from "@/databases/index";
import logger from "@/utils/logger";
import { notificationService } from "./service.loader";

/**
 * @description 필수 초기 로더
 */
export const essentialInitLoader = async () => {
  try {
    await startRedis();

    notificationService.regularlySchedule();
  } catch (error) {
    logger.error(error);
  }
};
