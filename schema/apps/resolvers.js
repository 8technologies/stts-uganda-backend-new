import { GraphQLError } from "graphql";
import { baseUrl, db } from "../../config/config.js";

export const getSystemApps = async ({
  limit = 100,
  offset = 0,
  id,
  role_id,
}) => {
  try {
    let values = [];
    let where = "";
    let extra_join = "";

    if (id) {
      where += " AND id = ?";
      values.push(id);
    }

    if (role_id) {
      where += " AND role_modules.role_id = ?";
      extra_join +=
        " INNER JOIN role_modules ON role_modules.module_id = apps.id";
      values.push(role_id);
    }

    let sql = `
      SELECT 
        *
      FROM apps 
      ${extra_join} 
      WHERE deleted = 0 ${where}
      ORDER BY sort ASC
      LIMIT ? OFFSET ?
    `;

    values.push(limit, offset);

    const [results] = await db.execute(sql, values);

    const updatedApps = results.map((item) => {
      return {
        ...item,
        logo: item.logo ? `${baseUrl}${item.logo}` : null,
      };
    });

    // console.log("updatedModules", updatedModules);

    return updatedApps;
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
