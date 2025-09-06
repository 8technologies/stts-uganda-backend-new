import { GraphQLError } from "graphql";
import { db } from "../../config/config.js";

export const getSystemApps = async ({ limit = 100, offset = 0, id }) => {
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
      FROM apps WHERE deleted = 0 ${where}
      ORDER BY sort ASC
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
  Query: {
    apps: async (_, args) => {
      try {
        const systemApps = await getSystemApps({});

        return systemApps;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
  },
};

export default schoolPeriodicObservationResolvers;
