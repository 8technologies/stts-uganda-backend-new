import { db } from "../../config/config.js";
import { GraphQLError } from "graphql";
import saveData from "../../utils/db/saveData.js";
import { JSONResolver } from "graphql-scalars";
import tryParseJSON from "../../helpers/tryParseJSON.js";

export const getForms = async ({ id, form}) => {
  try {
    let values = [];
    let where = "";
    let sql = "";

    if (id ) {
      where += " AND f.user_id = ?";
      values.push(id);
    }

    if(form === "sr4"){
       sql = `SELECT f.* FROM form_sr4s AS f WHERE deleted = 0 ${where} ORDER BY f.id DESC`;
    }
    if(form === "sr6"){
      sql = `SELECT f.* FROM form_sr6s AS f WHERE deleted = 0 ${where} ORDER BY f.id DESC`;
    }
    if(form === "qds"){

      sql = `SELECT f.* FROM form_qds AS f WHERE deleted = 0 ${where} ORDER BY f.id DESC`;
    }
    

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

      return await getForms({
        id: user_id,
        form: "sr4"
      });

      
    },
    sr6_applications: async (_, args, context) => {
      const user_id = context.req.user.id;

      return await getForms({
        id: user_id,
        form: "sr6"
      });

      
    },
    qds_applications: async (_, args, context) => {
      const user_id = context.req.user.id;

      return await getForms({
        id: user_id,
        form: "qds"
      });
    },

  },
  Mutation: {
     saveForm: async (parent, args, context) => {
      try {
        let data = [];
        
        // const data = args.payload.{args.form};
        switch (args.form) {
          case 'form_sr4s':
            data = args.payload.form_sr4s;
            break;
          case 'form_sr6s':
            data = args.payload.form_sr6s;
            break;
          case 'form_qds':
            data = args.payload.form_qds;
            break;
          default:
            throw new Error("Unsupported form type");
        }

        console.log(data);

          const save_id = await saveData({
            table: args.form,
            data,
            id: args.payload.id,
            idColumn: "id",
          });
        

        return {
          success: true,
          message: args.payload.id 
            ? args.form +" updated successfully"
            : args.form +" Created Successfully",
          data: {
            id: save_id, 
            ...data
          },
        };
      } catch (error) {
        console.log("error", error);
        throw new GraphQLError(error.message);
      }
    },
  }
  
};

export default applicationFormsResolvers;
