import { db } from "../../config/config.js";
import { GraphQLError } from "graphql";
import saveData from "../../utils/db/saveData.js";
import { JSONResolver } from "graphql-scalars";
import tryParseJSON from "../../helpers/tryParseJSON.js";
import checkPermission from "../../helpers/checkPermission.js";
import hasPermission from "../../helpers/hasPermission.js";

export const getForms = async ({ id, form_type, user_id }) => {
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
    `;

    const [results] = await db.execute(sql, values);

    return results;
  } catch (error) {
    console.log("errorzzzzzzzzz", error);
    throw new GraphQLError("Error fetching forms");
  }
};

const applicationFormsResolvers = {
  JSON: JSONResolver,
  Query: {
    sr4_applications: async (_, args, context) => {
      const user_id = context.req.user.id;
      const userPermissions = context.req.user.permissions;

      checkPermission(
        userPermissions,
        "can_view_sr4_forms",
        "You dont have permissions to view SR4 forms"
      );

      return await getForms({
        user_id: user_id,
        form_type: "sr4",
      });
    },
    sr4_application_details: async (_, args, context) => {
      const {id} = args
      const userPermissions = context.req.user.permissions;

      checkPermission(
        userPermissions,
        "can_view_sr4_forms",
        "You dont have permissions to view SR4 forms"
      );

      const results =  await getForms({
        id,
        form_type: "sr4",
      });

      return results[0];
    },
    sr6_applications: async (_, args, context) => {
      const user_id = context.req.user.id;

      return await getForms({
        id: user_id,
        form: "sr6",
      });
    },
    qds_applications: async (_, args, context) => {
      const user_id = context.req.user.id;

      return await getForms({
        id: user_id,
        form: "qds",
      });
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
          name_of_applicant,
          address,
          phone_number,
          company_initials,
          premises_location,
          years_of_experience,
          experienced_in,
          dealers_in,
          processing_of,
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
          valid_from,
          valid_until,
          status,
          status_comment,
          recommendation,
          inspector_id,
          dealers_in_other,
          marketing_of_other,
          have_adequate_storage,
          seed_board_registration_number,
          type,
          processing_of_other,
        } = args.payload;

        // construct the data object for application forms
        let data = {
          user_id,
          name_of_applicant,
          address,
          phone_number,
          company_initials,
          premises_location,
          years_of_experience,
          valid_from,
          valid_until,
          inspector_id,
          status,
          status_comment,
          recommendation,
          have_adequate_storage,
          dealers_in,
        };

        console.log(data);

        const save_id = await saveData({
          table: "application_forms",
          data,
          id,
          connection,
        });

        // data object for sr4 Forms
        let sr4_data = {
          application_form_id: save_id,
          experienced_in,
          type,
          processing_of,
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
          dealers_in_other,
          seed_board_registration_number,
          processing_of_other,
          marketing_of,
          marketing_of_other,
        };

        const save_id2 = await saveData({
          table: "sr4_application_forms",
          data: sr4_data,
          id,
          idColumn: "application_form_id",
          connection,
        });

        await connection.commit();

        return {
          success: true,
          message: args.payload.id
            ? " SR4 forms updated successfully"
            : "SR4 forms Created Successfully",
          result: {
            id: save_id,
            ...data,
            ...sr4_data,
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
