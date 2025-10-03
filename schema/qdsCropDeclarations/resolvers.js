import { db } from "../../config/config.js";
import { GraphQLError } from "graphql";
import saveData from "../../utils/db/saveData.js";
import { JSONResolver } from "graphql-scalars";
import checkPermission from "../../helpers/checkPermission.js";
import { getForms } from "../application_form/resolvers.js";
import hasPermission from "../../helpers/hasPermission.js";
import { getUsers } from "../user/resolvers.js";
import saveUpload from "../../helpers/saveUpload.js";

const mapCrop = (row) => ({
  id: String(row.id),
  crop_declaration_id: String(row.crop_declaration_id),
  crop_id: String(row.crop_id),
  variety_id: String(row.variety_id),
});

const mapCropDeclaration = (row) => ({
  id: String(row.id),

  user_id: row.user_id ? String(row.user_id) : null,
  application_id: row.application_id ? String(row.application_id) : null,

  source_of_seed: row.source_of_seed,
  field_size: row.field_size != null ? Number(row.field_size) : null,
  seed_rate: row.seed_rate != null ? Number(row.seed_rate) : null,
  amount: row.amount != null ? Number(row.amount) : null,
  receipt_id: row.receipt_id || null,

  status: row.status,
  status_comment: row.status_comment,
  valid_from: row.valid_from,
  valid_until: row.valid_until,

  created_at: row.created_at,
  updated_at: row.updated_at,

  // Nested relations
  crops: Array.isArray(row.crops)
    ? row.crops.map((c) => ({
        id: String(c.id),
        crop_declaration_id: String(c.crop_declaration_id),
        crop_id: c.crop_id ? String(c.crop_id) : null,
        variety_id: c.variety_id ? String(c.variety_id) : null,
      }))
    : [],

  inspector: row.inspector
    ? {
        id: String(row.inspector.id),
        username: row.inspector.username,
        name: row.inspector.name,
      }
    : null,

  createdBy: row.createdBy
    ? {
        id: String(row.createdBy.id),
        username: row.createdBy.username,
        name: row.createdBy.name,
        email: row.createdBy.email,
      }
    : null,
});


export const fetchCropDeclarationById = async (id, conn = db) => {
  const [rows] = await conn.execute(
    "SELECT * FROM qds_crop_declaration WHERE id = ?",
    [id]
  );
  if (!rows.length) return null;
  return mapCropDeclaration(rows[0]);
};

export const getCropDeclarations = async ({ id, user_id, filter = {}, pagination = {} }) => {
  try {
    const page = Math.max(1, Number(pagination.page || 1));
    const size = Math.max(1, Math.min(100, Number(pagination.size || 20)));
    const offset = (page - 1) * size;

    console.log("filters", filter);

    let values = [];
    let where = "";


    if (filter.user_id) {
      where += " AND q.user_id = ?";
      values.push(user_id);
    }

    if (filter.createdById && filter.inspectorId) {
        where += " AND (created_by = ? OR inspector_id = ?)";
        values.push(filter.createdById, filter.inspectorId);
    } else if (filter.createdById) {
        where += " AND created_by = ?";
        values.push(filter.createdById);
    } else if (filter.inspectorId) {
        where += " AND (created_by = ? OR inspector_id = ?)";
        values.push(filter.inspectorId, filter.inspectorId);
    }''

    if (filter.search) {
    where +=
      " AND (applicant_name LIKE ? OR field_name LIKE ? OR garden_number LIKE ? OR seed_lot_code LIKE ?)";
    values.push(
      `%${filter.search}%`,
      `%${filter.search}%`,
      `%${filter.search}%`,
      `%${filter.search}%`
    );
  }

    /* let sql = `SELECT q.* FROM qds_crop_declaration AS q WHERE deleted = 0 ${where} ORDER BY q.id DESC`;

    const [results] = await db.execute(sql, values);

    return results; */

    const [[countRow]] = await db.execute(
        `SELECT COUNT(*) AS total FROM qds_crop_declaration ${where}`,
        values
    );
    const total = Number(countRow?.total || 0);

    const [rows] = await db.execute(
    `SELECT * FROM qds_crop_declaration WHERE deleted = 0 ${where} ORDER BY id DESC LIMIT ? OFFSET ?`,
    [...values, size, offset]
    );

    console.log("rows", rows);

    return { items: rows.map(mapCropDeclaration), total };

  } catch (error) {
    console.log("error", error);
    throw new GraphQLError("Error fetching roles");
  }
};

const fetchCrops = async (crop_declaration_id, conn = db) => {
  const [rows] = await conn.execute(
    "SELECT * FROM qds_crop_declaration_crops WHERE crop_declaration_id = ? ORDER BY id ASC",
    [crop_declaration_id]
  );
  return rows.map(mapCrop);
};

const roleResolvers = {
  JSON: JSONResolver,
  Query: {
    
    cropDeclarations: async (parent, args, context) => {
        try{
            const user_id = context.req.user.id;
            const userPermissions = context.req.user.permissions;
            checkPermission(
                userPermissions,
                "can_view_qds_forms",
                "You dont have permissions to view crop declarations"
            );

            const can_manage_all_forms = hasPermission(
                userPermissions,
                "can_manage_all_forms"
            );
            const canViewAssignedPlantingReturns = hasPermission(
                userPermissions,
                "can_view_only_assigned_planting_returns"
            );

            const canManageAllPlantingReturns = hasPermission(
                userPermissions,
                "can_manage_planting_returns"
            );
            const { filter, pagination } = args || {};

            let newFilters = {
                ...filter,
                inspectorId: canViewAssignedPlantingReturns ? user_id : null,
                createdById: !canManageAllPlantingReturns ? user_id : null,
            };

            console.log("newFilters", newFilters);

            const result = await getCropDeclarations({
                user_id: !can_manage_all_forms ? user_id : null,
            });

            return result;

        }catch(error){
            console.log("error", error);
        }
        
    },
    cropDeclaration: async (parent, args, context) => {
        const userPermissions = context.req.user.permissions;
        checkPermission(
            userPermissions,
            "can_view_planting_returns",
            "You dont have permissions to view planting returns"
        );
        return fetchCropDeclarationById(args.id);
    }
  },
  CropDeclaration: {
    crops: async (parent, args, context) => {
      return await fetchCrops(parent.id);
    },
    createdBy: async (parent) => {
        const [user] = await getUsers({ id: parent.userId });
        if (!user) return null;
        return user;
    },
    inspector: async (parent) => {
        if (!parent.inspector_id) return null;
        const [user] = await getUsers({ id: parent.inspector_id });
        if (!user) return null;
        return user;
    },
  },
  Mutation: {
    saveCropDeclaration: async (parent, args, context) => {
      
        const { 
            id,
            source_of_seed,
            field_size,
            seed_rate,
            amount,
            receipt_id,
            crops: {
                crop_id,
                variety_id
            }
        } = args.payload;

        const user_id = context.req.user.id;
        const userPermissions = context.req.user.permissions;
        checkPermission(
            userPermissions,
            "can_view_qds_forms",
            "You dont have permissions to view crop declarations"
        );

        const qdsapplication = await getForms({
          user_id: user_id,
          form_type: "qds",
          status: "approved",})
        if (!qdsapplication || qdsapplication.length === 0) {
            throw new GraphQLError("No approved QDS application found for this user");
        }
        console.log('qdsapplication', qdsapplication)
        // pick the first application in the array
        const application = qdsapplication[0];

      const conn = await db.getConnection();
      try {
        await conn.beginTransaction();
        const data = {
            source_of_seed,
            field_size,
            seed_rate,
            amount,
            application_id: application?.id ?? null,
            status: "pending",
            user_id,
        };
        const crops = args.payload.crops || [];
        console.log("data", crops);

        const save_id = await saveData({
          table: "qds_crop_declaration",
          data,
          id,
          idColumn: "id",
          conn
        });

        let savedReceiptInfo = null;
        if (receipt_id) {
          try {
            savedReceiptInfo = await saveUpload({
              file: receipt_id,
              subdir: "form_attachments",
            });
          } catch (e) {
            // If upload fails, rollback and bubble up
            throw new GraphQLError(`Receipt upload failed: ${e.message}`);
          }
        }else{
          console.log('no receipt')
        }

        if (savedReceiptInfo) {
          try {
            // Update application_forms with receipt_id
            await saveData({
              table: "qds_crop_declaration",
              data: { receipt_id: savedReceiptInfo.filename },
              id: save_id,
              conn,
            });
          } catch (e) {
            // Non-fatal for the core form save; log but do not block
            console.error(
              "Failed to save form_attachments record or update receipt_id:",
              e.message
            );
          }
        }else{
          console.log('no savedReceiptInfo')
        }

        const crop_declaration_id = save_id;
        // Crops
       /*  if (Array.isArray(crops) && crops.length) {
          const placeholders = crops
            .map(() => "(?, ?, ?)")
            .join(", ");
          const values = crops.flatMap((i) => [
            crop_declaration_id,
            i.crop_id,
            i.variety_id,
          ]);
          console.log("values", values);
          await conn.execute(
            `INSERT INTO qds_crop_declaration_crops (crop_declaration_id, crop_id, variety_id) VALUES ${placeholders}`,
            values
          );
        } */

        if (Array.isArray(crops) && crops.length) {
          const placeholders = crops.map(() => "(?, ?, ?)").join(", ");
          const values = crops.flatMap((i) => [
            crop_declaration_id,
            i.crop_id,
            i.variety_id
          ]);

          await conn.execute(
            `INSERT INTO qds_crop_declaration_crops (crop_declaration_id, crop_id, variety_id)
            VALUES ${placeholders}
            ON DUPLICATE KEY UPDATE
              variety_id = VALUES(variety_id)`,
            values
          );
        }


        await conn.commit();
        return {
          success: true,
          message: id
            ? "Crop Declaration updated successfully"
            : "Crop Declaration Created Successfully",
          data: {
            id: save_id,
            ...data,

          },
        };
      } catch (error) {
        await conn.rollback();
        console.log("error", error);
        throw new GraphQLError(error.message);
      }
    },
    

    /* deleteCropDeclaration: async (parent, args, context) => {
      const userPermissions = context.req.user.permissions;
      checkPermission(
        userPermissions,
        "can_delete_planting_returns",
        "You dont have permissions to delete planting returns"
      );
      try {

        await db.execute(
          "UPDATE qds_crop_declaration SET deleted = 1 WHERE id = ?",
          [args.cropDeclarationId]
        );

        return {
          success: true,
          message: "Crop declaration deleted successfully",
        };
      } catch (error) {
        throw new GraphQLError(error.message);
        
      }
    }, */

    deleteCropDeclaration: async (parent, args, context) => {
  const userPermissions = context.req.user.permissions;
  checkPermission(
    userPermissions,
    "can_delete_planting_returns",
    "You dont have permissions to delete planting returns"
  );

  const { crop_declaration_id } = args; // use the exact variable name from the schema

  if (!crop_declaration_id) {
    throw new GraphQLError("crop_declaration_id is required");
  }

  try {
    await db.execute(
      "UPDATE qds_crop_declaration SET deleted = 1 WHERE id = ?",
      [crop_declaration_id]
    );

    return {
      success: true,
      message: "Crop declaration deleted successfully",
    };
  } catch (error) {
    throw new GraphQLError(error.message);
  }
},

    
  },
};

export default roleResolvers;
