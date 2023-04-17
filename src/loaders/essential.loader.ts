import { startRedis, startRelationDatabase } from "@/databases/index";
import logger from "@/utils/logger";

/**
 * @description 필수 초기 로더
 */
export const essentialInitLoader = async () => {
  try {
    await startRedis();
    await startRelationDatabase();
  } catch (error) {
    logger.error(error);
  }
};
