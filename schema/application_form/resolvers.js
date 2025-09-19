import { db } from "../../config/config.js";
import { GraphQLError } from "graphql";
import saveData from "../../utils/db/saveData.js";
import { JSONResolver } from "graphql-scalars";
import tryParseJSON from "../../helpers/tryParseJSON.js";
import checkPermission from "../../helpers/checkPermission.js";
import hasPermission from "../../helpers/hasPermission.js";
import { getUsers } from "../user/resolvers.js";
import saveUpload from "../../helpers/saveUpload.js";

export const getForms = async ({ id, form_type, user_id, inspector_id }) => {
  try {
    let values = [];
    let where = "";
    let extra_join = "";
    let extra_select = "";

    if (id) {
      where += " AND application_forms.id = ?";
      values.push(id);
    }

    if (user_id) {
      where += " AND application_forms.user_id = ?";
      values.push(user_id);
    }

    if (form_type) {
      where += " AND application_forms.form_type = ?";
      values.push(form_type);
    }

    if (inspector_id) {
      where += " AND application_forms.inspector_id = ?";
      values.push(inspector_id);
    }

    if (form_type == "sr4") {
      extra_join +=
        " LEFT JOIN sr4_application_forms ON sr4_application_forms.application_form_id = application_forms.id";
      extra_select += ` sr4_application_forms.experienced_in,
                        sr4_application_forms.processing_of, 
                        sr4_application_forms.marketing_of,
                        sr4_application_forms.have_adequate_land, 
                        sr4_application_forms.land_size, 
                        sr4_application_forms.equipment, 
                        sr4_application_forms.have_adequate_equipment, 
                        sr4_application_forms.have_contractual_agreement, 
                        sr4_application_forms.have_adequate_field_officers, 
                        sr4_application_forms.have_conversant_seed_matters, 
                        sr4_application_forms.have_adequate_land_for_production, 
                        sr4_application_forms.have_internal_quality_program, 
                        sr4_application_forms.source_of_seed, 
                        sr4_application_forms.receipt, 
                        sr4_application_forms.accept_declaration, 
                        sr4_application_forms.dealers_in_other, 
                        sr4_application_forms.marketing_of_other, 
                        sr4_application_forms.seed_board_registration_number, 
                        sr4_application_forms.processing_of_other,
                        sr4_application_forms.type,
                        `;
    }
    if (form_type == "sr6") {
      extra_join +=
        " LEFT JOIN sr6_application_forms ON sr6_application_forms.application_form_id = application_forms.id";
      extra_select += ` sr6_application_forms.have_adequate_isolation,
                            sr6_application_forms.have_adequate_labor, 
                            sr6_application_forms.aware_of_minimum_standards,
                            sr6_application_forms.seed_grower_in_past, 
                            sr6_application_forms.type, 
                            `;
    }

    if (form_type == "qds") {
      extra_join +=
        " LEFT JOIN qds_application_forms ON qds_application_forms.application_form_id = application_forms.id";
      extra_select += ` qds_application_forms.certification,
                            qds_application_forms.inspector_comment, 
                            qds_application_forms.have_been_qds,
                            qds_application_forms.isolation_distance, 
                            qds_application_forms.number_of_labors, 
                            qds_application_forms.have_adequate_storage_facility, 
                            qds_application_forms.is_not_used, 
                            qds_application_forms.examination_category, 
                            `;
    }

    let sql = `
      SELECT 
      ${extra_select}
      application_forms.*
      FROM
      application_forms
      ${extra_join}
      WHERE application_forms.deleted = 0 ${where}
      ORDER BY created_at DESC
    `;

    const [results] = await db.execute(sql, values);

    return results;
  } catch (error) {
    console.log("error", error);
    throw new GraphQLError("Error fetching forms");
  }
};

const applicationFormsResolvers = {
  JSON: JSONResolver,
  Query: {
    sr4_applications: async (_, args, context) => {
      try {
        const user_id = context.req.user.id;
        const userPermissions = context.req.user.permissions;

        checkPermission(
          userPermissions,
          "can_view_sr4_forms",
          "You dont have permissions to view SR4 forms"
        );

        const results = await getForms({
          user_id: hasPermission(userPermissions, "can_manage_all_forms")
            ? null
            : user_id,
          form_type: "sr4",
        });

        console.log("results", results);

        return results;
      } catch (error) {
        console.log(error.message);
      }
    },
    sr4_application_details: async (_, args, context) => {
      const { id } = args;
      const userPermissions = context.req.user.permissions;

      checkPermission(
        userPermissions,
        "can_view_sr4_forms",
        "You dont have permissions to view SR4 forms"
      );

      const results = await getForms({
        id,
        form_type: "sr4",
      });

      return results[0];
    },
    sr6_applications: async (_, args, context) => {
      const user_id = context.req.user.id;
      const userPermissions = context.req.user.permissions;

      checkPermission(
        userPermissions,
        "can_view_sr6_forms",
        "You dont have permissions to view SR6 forms"
      );

      return await getForms({
        user_id: hasPermission(userPermissions, "can_manage_all_forms")
          ? null
          : user_id,
        form_type: "sr6",
      });
    },
    sr6_application_details: async (_, args, context) => {
      const { id } = args;
      const userPermissions = context.req.user.permissions;

      checkPermission(
        userPermissions,
        "can_view_sr6_forms",
        "You dont have permissions to view SR6 forms"
      );

      const results = await getForms({
        id,
        form_type: "sr6",
      });

      return results[0];
    },
    qds_applications: async (_, args, context) => {
      const user_id = context.req.user.id;
      const userPermissions = context.req.user.permissions;

      checkPermission(
        userPermissions,
        "can_view_qds_forms",
        "You dont have permissions to view QDs forms"
      );
      return await getForms({
        user_id: hasPermission(userPermissions, "can_manage_all_forms")
          ? null
          : user_id,
        form_type: "qds",
      });
    },
    qds_application_details: async (_, args, context) => {
      const { id } = args;
      const userPermissions = context.req.user.permissions;

      checkPermission(
        userPermissions,
        "can_view_qds_forms",
        "You dont have permissions to view QDs forms"
      );

      const results = await getForms({
        id,
        form_type: "qds",
      });

      return results[0];
    },
  },
  SR4ApplicationForm: {
    inspector: async (parent, args, context) => {
      try {
        const inspector_id = parent.inspector_id;

        if (!inspector_id) return null;

        const [user] = await getUsers({
          id: inspector_id,
        });

        return user;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
    user: async (parent) => {
      try {
        const user_id = parent.user_id;

        const [user] = await getUsers({
          id: user_id,
        });
        return user;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
  },
  SR6ApplicationForm: {
    inspector: async (parent, args, context) => {
      try {
        const inspector_id = parent.inspector_id;

        const [user] = await getUsers({
          id: inspector_id,
        });

        return user;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
    user: async (parent) => {
      try {
        const user_id = parent.user_id;

        const [user] = await getUsers({
          id: user_id,
        });
        return user;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
  },
  QDsApplicationForm: {
    inspector: async (parent, args, context) => {
      try {
        const inspector_id = parent.inspector_id;

        if (!inspector_id) return null;

        const [user] = await getUsers({
          id: inspector_id,
        });

        return user;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
    user: async (parent) => {
      try {
        const user_id = parent.user_id;

        const [user] = await getUsers({
          id: user_id,
        });
        return user;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
  },
  SR6ApplicationForm: {
    inspector: async (parent, args, context) => {
      try {
        const inspector_id = parent.inspector_id;

        const [user] = await getUsers({
          id: inspector_id,
        });

        return user;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
    user: async (parent) => {
      try {
        const user_id = parent.user_id;

        const [user] = await getUsers({
          id: user_id,
        });
        return user;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
  },
  QDsApplicationForm: {
    inspector: async (parent, args, context) => {
      try {
        const inspector_id = parent.inspector_id;

        const [user] = await getUsers({
          id: inspector_id,
        });

        return user;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
    user: async (parent) => {
      try {
        const user_id = parent.user_id;

        const [user] = await getUsers({
          id: user_id,
        });
        return user;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
  },
  SR6ApplicationForm: {
    inspector: async (parent, args, context) => {
      try {
        const inspector_id = parent.inspector_id;

        const [user] = await getUsers({
          id: inspector_id,
        });

        return user;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
    user: async (parent) => {
      try {
        const user_id = parent.user_id;

        const [user] = await getUsers({
          id: user_id,
        });
        return user;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
  },
  QDsApplicationForm: {
    inspector: async (parent, args, context) => {
      try {
        const inspector_id = parent.inspector_id;

        const [user] = await getUsers({
          id: inspector_id,
        });

        return user;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
    user: async (parent) => {
      try {
        const user_id = parent.user_id;

        const [user] = await getUsers({
          id: user_id,
        });
        return user;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
  },
  Mutation: {
    saveSr4Form: async (parent, args, context) => {
      const connection = await db.getConnection();
      try {
        await connection.beginTransaction();
        const user_id = context.req.user.id;
        const {
          id,
          years_of_experience,
          experienced_in,
          dealers_in,
          marketing_of,
          have_adequate_land,
          land_size,
          equipment,
          have_adequate_equipment,
          have_contractual_agreement,
          have_adequate_field_officers,
          have_conversant_seed_matters,
          have_adequate_land_for_production,
          have_internal_quality_program,
          source_of_seed,
          receipt,
          accept_declaration,
          // valid_from,
          // valid_until,
          status,
          // status_comment,
          // recommendation,
          // inspector_id,
          dealers_in_other,
          marketing_of_other,
          have_adequate_storage,
          // seed_board_registration_number,
          type,
          // processing_of_other,
        } = args.payload;

        console.log("args.payload", args.payload);

        // construct the data object for application forms
        let data = {
          user_id,
          years_of_experience,
          // valid_from,
          // valid_until,
          // inspector_id,
          status,
          // status_comment,
          // recommendation,
          // valid_from: valid_from || null,
          // valid_until: valid_until || null,
          // inspector_id: inspector_id || null,
          status: "pending",
          // status_comment,
          // recommendation,
          have_adequate_storage,
          dealers_in,
          form_type: "sr4",
        };

        console.log("data", data);

        const save_id = await saveData({
          table: "application_forms",
          data,
          id,
          connection,
        });

        // If a receipt was uploaded, save it and capture its public path
        let savedReceiptInfo = null;
        if (receipt) {
          try {
            savedReceiptInfo = await saveUpload({
              file: receipt,
              subdir: "form_attachments",
            });
          } catch (e) {
            // If upload fails, rollback and bubble up
            throw new GraphQLError(`Receipt upload failed: ${e.message}`);
          }
        }

        // data object for sr4 Forms (conditionally include receipt only if provided)
        let sr4_data = {
          application_form_id: save_id,
          experienced_in,
          type,
          // processing_of,
          have_adequate_land,
          land_size,
          // equipment,
          have_adequate_equipment,
          have_contractual_agreement,
          have_adequate_field_officers,
          have_conversant_seed_matters,
          have_adequate_land_for_production,
          have_internal_quality_program,
          source_of_seed: source_of_seed || null,
          // receipt,
          // accept_declaration,
          dealers_in_other: dealers_in_other || null,
          // // seed_board_registration_number,
          // processing_of_other,
          accept_declaration: accept_declaration || null,
          // dealers_in_other,
          // seed_board_registration_number,
          // processing_of_other,
          marketing_of,
          // marketing_of_other,
        };

        // Do not set receipt on sr4 table; receipt_id is kept on application_forms

        console.log("sr4_data", sr4_data);

        const save_id2 = await saveData({
          table: "sr4_application_forms",
          data: sr4_data,
          id,
          idColumn: "application_form_id",
          connection,
        });

        // Record attachment metadata in form_attachments if a receipt was uploaded
        if (savedReceiptInfo) {
          try {
            // const attachment_id = await saveData({
            //   table: "form_attachments",
            //   data: {
            //     application_form_id: save_id,
            //     form_type: "sr4",
            //     field: "receipt",
            //     file_name: savedReceiptInfo.filename,
            //     file_path: savedReceiptInfo.path,
            //   },
            //   connection,
            // });

            // Update application_forms with receipt_id
            await saveData({
              table: "application_forms",
              data: { receipt_id: savedReceiptInfo.filename },
              id: save_id,
              connection,
            });
          } catch (e) {
            // Non-fatal for the core form save; log but do not block
            console.error(
              "Failed to save form_attachments record or update receipt_id:",
              e.message
            );
          }
        }

        await connection.commit();

        return {
          success: true,
          message: args.payload.id
            ? " SR4 form updated successfully"
            : "SR4 form Created Successfully",
          result: {
            id: save_id,
            ...data,
            ...sr4_data,
          },
        };
      } catch (error) {
        await connection.rollback();
        throw new GraphQLError(error.message);
      }
    },

    saveSr6Form: async (parent, args, context) => {
      const connection = await db.getConnection();
      try {
        await connection.beginTransaction();
        const user_id = context.req.user.id;
        const {
          id,
          years_of_experience,
          dealers_in,
          previous_grower_number,
          cropping_history,
          have_adequate_isolation,
          have_adequate_labor,
          aware_of_minimum_standards,
          signature_of_applicant,
          grower_number,
          inspector_id,
          registration_number,
          valid_from,
          valid_until,
          status,
          status_comment,
          recommendation,
          have_adequate_storage,
          seed_grower_in_past,
          type,
        } = args.payload;

        // construct the data object for application forms
        let data = {
          user_id,
          previous_grower_number,
          years_of_experience,
          signature_of_applicant,
          registration_number,
          valid_from,
          valid_until,
          inspector_id,
          cropping_history,
          grower_number,
          status,
          status_comment,
          recommendation,
          have_adequate_storage,
          dealers_in,
          form_type: "sr6",
        };

        const save_id = await saveData({
          table: "application_forms",
          data,
          id,
          connection,
        });

        // data object for sr4 Forms
        let sr6_data = {
          application_form_id: save_id,
          have_adequate_isolation,
          have_adequate_labor,
          aware_of_minimum_standards,
          seed_grower_in_past,
          type,
        };

        const save_id2 = await saveData({
          table: "sr6_application_forms",
          data: sr6_data,
          id,
          idColumn: "application_form_id",
          connection,
        });

        await connection.commit();

        return {
          success: true,
          message: args.payload.id
            ? "SR6 form updated successfully"
            : "SR6 form Created Successfully",
          result: {
            id: save_id,
            ...data,
            ...sr6_data,
          },
        };
      } catch (error) {
        console.log("error", error);
        await connection.rollback();
        throw new GraphQLError(error.message);
      }
    },
    saveQdsForm: async (parent, args, context) => {
      const connection = await db.getConnection();
      try {
        await connection.beginTransaction();
        const user_id = context.req.user.id;
        const {
          id,
          certification,
          years_of_experience,
          dealers_in,
          previous_grower_number,
          cropping_history,
          have_adequate_isolation,
          have_adequate_labor,
          aware_of_minimum_standards,
          signature_of_applicant,
          grower_number,
          registration_number,
          status,
          have_been_qds,
          isolation_distance,
          number_of_labors,
          have_adequate_storage_facility,
          is_not_used,
          examination_category,
        } = args.payload;

        // construct the data object for application forms
        let data = {
          user_id,
          years_of_experience,
          dealers_in,
          previous_grower_number,
          cropping_history,
          signature_of_applicant,
          grower_number,
          registration_number,
          status,
          form_type: "qds",
        };

        const save_id = await saveData({
          table: "application_forms",
          data,
          id,
          connection,
        });

        // data object for qds Forms
        let qds_data = {
          application_form_id: save_id,
          certification,
          have_adequate_isolation,
          have_adequate_labor,
          aware_of_minimum_standards,
          have_been_qds,
          isolation_distance,
          number_of_labors,
          have_adequate_storage_facility,
          is_not_used,
          examination_category,
        };

        const save_id2 = await saveData({
          table: "qds_application_forms",
          data: qds_data,
          id,
          idColumn: "application_form_id",
          connection,
        });

        await connection.commit();

        return {
          success: true,
          message: args.payload.id
            ? "QDs form updated successfully"
            : "QDs form Created Successfully",
          result: {
            id: save_id,
            ...data,
            ...qds_data,
          },
        };
      } catch (error) {
        console.log("error", error);
        await connection.rollback();
        throw new GraphQLError(error.message);
      }
    },
  },
};

export default applicationFormsResolvers;
