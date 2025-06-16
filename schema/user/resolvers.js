import { GraphQLError } from "graphql";
import { GraphQLDate, GraphQLDateTime } from "graphql-scalars";
import { db } from "../../config/config.js";
import saveData from "../../utils/db/saveData.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const loginUser = async ({ email, password, user_id, context }) => {
  try {
    let values = [];
    let where = "";

    if (email) {
      where += " AND email = ?";
      values.push(email);
    }

    if (user_id) {
      where += " AND id = ?";
      values.push(id);
    }

    let sql = `SELECT * FROM users WHERE deleted = 0 ${where}`;

    // let [results] = await db.execute(sql, values);
    const [results] = await db.execute(sql, values);

    const user = results[0];

    // console.log("user", results[0]);
    if (!user) throw new GraphQLError("Invalid Email or Password");

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) throw new GraphQLError("Invalid Email or Password");

    if (!user.is_active)
      throw new GraphQLError(
        "Account suspended, Please contact the admin for rectification!!!"
      );

    // Access the IP address from the context
    // const clientIpAddress = context.req.connection.remoteAddress;

    // using the role_id, to get the role of the user
    // const [role] = await getRoles({
    //   id: user.role_id,
    // });

    // if (!role) throw new GraphQLError("User has no role in the system!");

    return {
      success: true,
      message: "Login Successful",
      user: user,
    };
  } catch (error) {
    throw new GraphQLError(error.message);
  }
};

export const getUsers = async ({ limit = 10, offset = 0, email, id }) => {
  try {
    let where = "WHERE users.deleted = 0";
    let values = [];

    if (email) {
      where += " AND users.email = ?";
      values.push(email);
    }

    if (id) {
      where += " AND users.id = ?";
      values.push(id);
    }

    let sql = `
      SELECT * FROM USERS ${where} ORDER BY users.updated_at DESC LIMIT ? OFFSET ?
    `;

    values.push(limit, offset);

    const [results] = await db.execute(sql, values);

    return results;
  } catch (error) {
    throw new GraphQLError(error.message);
  }
};

const userResolvers = {
  Date: GraphQLDate,
  Query: {
    users: async (_, args) => {
      return await getUsers({});
    },
  },
  SchoolPeriodicObservation: {
    infrastructure: (parent) => ({
      computers: parent.computers,
      tablets: parent.tablets,
      projectors: parent.projectors,
      printers: parent.printers,
      internet_connection: parent.internet_connection,
      internet_speed_mbps: parent.internet_speed_mbps,
      power_source: parent.power_source,
      power_backup: parent.power_backup,
      functional_devices: parent.functional_devices,
    }),
    usage: (parent) => ({
      teachers_using_ict: parent.teachers_using_ict,
      total_teachers: parent.total_teachers,
      weekly_computer_lab_hours: parent.weekly_computer_lab_hours,
      student_digital_literacy_rate: parent.student_digital_literacy_rate,
    }),
    software: (parent) => ({
      operating_systems: parent.operating_systems,
      educational_software: parent.educational_software,
      office_applications: parent.office_applications,
    }),
    capacity: (parent) => ({
      ict_trained_teachers: parent.ict_trained_teachers,
      support_staff: parent.support_staff,
    }),
  },
  Mutation: {
    createUser: async (parent, args, context) => {
      const { id, email, firstName, lastName, role, password } = args.payload;
      let connection = await db.getConnection();

      try {
        await connection.beginTransaction();
        // first, we need to check and see if we have the employee email in our records
        const users = await getUsers({
          email,
          limit: 1,
        });

        if (users[0] && !id)
          throw new GraphQLError("User email already exists!");

        // generate unique password for employee
        const salt = await bcrypt.genSalt();
        const hashedPwd = await bcrypt.hash(password, salt);

        const data = {
          email,
          first_name: firstName,
          last_name: lastName,
          password_hash: hashedPwd,
          role,
          created_at: new Date(),
        };

        if (!id) {
          data.id = uuidv4();
        }

        // then save in the db
        await saveData({
          table: "users",
          data: data,
          id: id ? id : null,
          connection: connection,
        });

        await connection.commit();

        return {
          success: true,
          message: "User Account created successfully",
        };
      } catch (error) {
        await connection.rollback();
        throw new GraphQLError(error.message);
      } finally {
        connection.release(); // Always release the connection back to the pool
      }
    },
    login: async (parent, args) => {
      const result = await loginUser({
        email: args.email,
        password: args.password,
      });

      return result;
    },
  },
};

export default userResolvers;
