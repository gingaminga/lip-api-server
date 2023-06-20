import { startRedis } from "@/databases/index";
import logger from "@/utils/logger";

/**
 * @description 필수 초기 로더
 */
export const essentialInitLoader = async () => {
  try {
    await startRedis();
  } catch (error) {
    logger.error(error);
  }
};
