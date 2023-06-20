import relationDatabaseConfig from "@/databases/rdb/config";
import constants from "@/utils/constants";
import logger from "@/utils/logger";
import colors from "ansi-colors";
import { DataSource } from "typeorm";
import { createDatabase } from "typeorm-extension";

export const dataSource = new DataSource(relationDatabaseConfig);

(async () => {
  await createDatabase({
    ifNotExist: true,
    options: relationDatabaseConfig,
  });

  await dataSource.initialize();

  logger.info(`${constants.DATABASE.TYPE} connect ${colors.green("success")} :)`);
})();
