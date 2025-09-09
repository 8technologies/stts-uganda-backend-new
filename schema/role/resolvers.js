import { db } from "../../config/config.js";
import { GraphQLError } from "graphql";
import saveData from "../../utils/db/saveData.js";
import { JSONResolver } from "graphql-scalars";
import tryParseJSON from "../../helpers/tryParseJSON.js";

export const getRoles = async ({ id }) => {
  try {
    let values = [];
    let where = "";

    if (id || id === 0) {
      where += " AND r.id = ?";
      values.push(id);
    }
    let sql = `SELECT r.* FROM roles AS r WHERE deleted = 0 ${where} ORDER BY r.id DESC`;

    const [results] = await db.execute(sql, values);

    return results;
  } catch (error) {
    console.log("error", error);
    throw new GraphQLError("Error fetching roles");
  }
};

const roleResolvers = {
  JSON: JSONResolver,
  Query: {
    roles: async (parent, args) => {
      const result = await getRoles({});

      const res = result.map((role) => ({
        ...role,
        permissions: tryParseJSON(tryParseJSON(role.permissions)),
      }));

      return res;
    },
  },
  Mutation: {
    saveRole: async (parent, args, context) => {
      try {
        const { id, role_name, description } = args.payload;

        const data = {
          name: role_name,
          description: description || null,
        };

        const save_id = await saveData({
          table: "roles",
          data,
          id,
          idColumn: "id",
        });

        return {
          success: true,
          message: id
            ? "Role updated successfully"
            : "Role Created Successfully",
          data: {
            id: save_id,
            name: role_name,
            description,
          },
        };
      } catch (error) {
        console.log("error", error);
        throw new GraphQLError(error.message);
      }
    },
    deleteRole: async (parent, args, context) => {
      try {
        const { role_id } = args;

        // await softDelete({
        //   table: "roles",
        //   id: role_id,
        //   idColumn: "role_id",
        // });

        // delete the role
        let sql = "DELETE FROM roles WHERE id = ?";
        let values = [role_id];

        await db.execute(sql, values);

        return {
          success: "true",
          message: "Role deleted successfully",
        };
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
    updateRolePermissions: async (parent, args, context) => {
      try {
        const { role_id, permissions } = args.payload;

        const data = {
          permissions: JSON.stringify(permissions),
        };

        const save_id = await saveData({
          table: "roles",
          data,
          id: role_id,
          idColumn: "id",
        });

        return {
          success: true,
          message: "Permissions Saved Successfully",
        };
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
  },
};

export default roleResolvers;
