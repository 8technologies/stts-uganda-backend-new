import { GraphQLError } from "graphql";
import { GraphQLDate, JSONResolver } from "graphql-scalars";
import { db } from "../../config/config.js";
import tryParseJSON from "../../helpers/tryParseJSON.js";

export const getSystemSettings = async ({ limit = 100, offset = 0, id }) => {
  try {
    let values = [];
    let where = "";

    if (id) {
      where += " AND id = ?";
      values.push(id);
    }

    let sql = `
      SELECT 
        *
      FROM system_settings WHERE deleted = 0 ${where}
      LIMIT ? OFFSET ?
    `;

    values.push(limit, offset);

    const [results] = await db.execute(sql, values);

    return results;
  } catch (error) {
    throw new GraphQLError(error.message);
  }
};

const schoolPeriodicObservationResolvers = {
  Date: GraphQLDate,
  JSON: JSONResolver,
  Query: {
    system_settings: async (_, args) => {
      try {
        const systemSettings = await getSystemSettings({});

        return systemSettings.map((setting) => ({
          ...setting,
          setting_value: tryParseJSON(setting.setting_value),
        }));
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
  },
};

export default schoolPeriodicObservationResolvers;
