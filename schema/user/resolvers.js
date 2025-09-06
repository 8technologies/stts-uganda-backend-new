import { GraphQLError } from "graphql";
import { GraphQLDate, GraphQLDateTime } from "graphql-scalars";
import { db, PRIVATE_KEY } from "../../config/config.js";
import saveData from "../../utils/db/saveData.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const loginUser = async ({ username, password, user_id, context }) => {
  try {
    let values = [];
    let where = "";

    if (username) {
      where += " AND username = ?";
      values.push(username);
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
    if (!user) throw new GraphQLError("Invalid Username or Password");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new GraphQLError("Invalid Username or Password");

    if (!user.is_active)
      throw new GraphQLError(
        "Account suspended, Please contact the admin for rectification!!!"
      );

    const tokenData = {
      id: user.id,
      email: user?.email || null,
    };

    const token = jwt.sign(tokenData, PRIVATE_KEY, {
      expiresIn: "1d",
    });

    context.res.setHeader("x-auth-token", `Bearer ${token}`);

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
      token,
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
      SELECT * FROM users ${where} ORDER BY users.updated_at DESC LIMIT ? OFFSET ?
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
  Mutation: {
    createUser: async (parent, args, context) => {
      const {
        id,
        email,
        firstName,
        lastName,
        role,
        password,
        district,
        subcounty,
        school_id,
      } = args.payload;
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
          district,
          subcounty,
          school_id,
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
    updateUser: async (parent, args, context) => {
      // Validate user authentication/authorization first
      // if (!context.user) {
      //   throw new GraphQLError("Unauthorized - You must be logged in", {
      //     extensions: { code: "UNAUTHORIZED" },
      //   });
      // }

      // Check if the authenticated user has permission to update this user
      // (Add your specific authorization logic here)

      const {
        id,
        email,
        firstName,
        lastName,
        role,
        isActive,
        district,
        subcounty,
        school_id,
      } = args.payload;

      // Basic input validation
      if (!id) {
        throw new GraphQLError("User ID is required", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      let connection;
      try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // Check if user exists
        const [user] = await getUsers({ id, limit: 1 });
        if (!user) {
          throw new GraphQLError("User not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        // Prepare update data
        const updateData = {
          email: email || user.email, // Keep existing if not provided
          first_name: firstName || user.first_name,
          last_name: lastName || user.last_name,
          role: role || user.role,
          is_active: isActive !== undefined ? isActive : user.is_active,
          district: district || user.district,
          subcounty: subcounty || user.subcounty,
          school_id: school_id || user.school_id,
          updated_at: new Date(),
        };

        // Validate email format if it's being updated
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          throw new GraphQLError("Invalid email format", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }

        // Update user in database
        await saveData({
          table: "users",
          data: updateData,
          id,
          connection,
        });

        await connection.commit();

        return {
          success: true,
          message: "User account updated successfully",
        };
      } catch (error) {
        if (connection) {
          await connection.rollback();
        }

        // Handle specific database errors
        if (error.code === "ER_DUP_ENTRY") {
          throw new GraphQLError("Email already exists", {
            extensions: { code: "CONFLICT" },
          });
        }

        // Pass through GraphQL errors, wrap others
        if (error instanceof GraphQLError) {
          throw error;
        }

        console.error("Update user error:", error);
        throw new GraphQLError("Failed to update user", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      } finally {
        if (connection) {
          connection.release();
        }
      }
    },
    login: async (parent, args, context) => {
      const result = await loginUser({
        username: args.username,
        password: args.password,
        context,
      });

      return result;
    },
    resetPassword: async (parent, args, context) => {
      const { id, newPassword } = args; // Note: Fixed typo from newPasswordd to newPassword
      let connection;

      try {
        // Authentication check
        // if (!context.user) {
        //   throw new GraphQLError("Unauthorized - You must be logged in", {
        //     extensions: { code: "UNAUTHORIZED" },
        //   });
        // }

        // Authorization - check if user has permission to reset this password
        // Option 1: Only allow users to reset their own password
        // if (context.user.id !== id && context.user.role !== 'ADMIN') {
        //   throw new GraphQLError("Unauthorized - You can only reset your own password", {
        //     extensions: { code: 'FORBIDDEN' },
        //   });
        // }

        // Option 2: Only allow admins to reset passwords
        // if (context.user.role !== 'ADMIN') {
        //   throw new GraphQLError("Unauthorized - Only admins can reset passwords", {
        //     extensions: { code: 'FORBIDDEN' },
        //   });
        // }

        // Input validation
        if (!id || !newPassword) {
          throw new GraphQLError("User ID and new password are required", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }

        if (newPassword.length < 8) {
          throw new GraphQLError("Password must be at least 8 characters", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }

        connection = await db.getConnection();
        await connection.beginTransaction();

        // Check if user exists
        const [user] = await getUsers({ id, limit: 1 });
        if (!user) {
          throw new GraphQLError("User not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt();
        const hashedPwd = await bcrypt.hash(newPassword, salt);

        // Update user password
        await saveData({
          table: "users",
          data: {
            password_hash: hashedPwd,
            updated_at: new Date(),
          },
          id: id,
          connection: connection,
        });

        await connection.commit();

        // Invalidate all existing sessions/tokens for this user (recommended)
        // Implement your session invalidation logic here if needed

        return {
          success: true,
          message: "Password reset successfully",
        };
      } catch (error) {
        if (connection) {
          await connection.rollback();
        }

        // Handle specific errors
        if (error instanceof GraphQLError) {
          throw error;
        }

        console.error("Password reset error:", error);
        throw new GraphQLError("Failed to reset password", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      } finally {
        if (connection) {
          connection.release();
        }
      }
    },
    deleteUser: async (parent, args, context) => {
      const { user_id } = args;
      let connection;

      try {
        // Authentication check
        // if (!context.user) {
        //   throw new GraphQLError("Unauthorized - You must be logged in", {
        //     extensions: { code: "UNAUTHORIZED" },
        //   });
        // }

        // Authorization - only allow admins or the user themselves to delete
        // if (context.user.id !== user_id && context.user.role !== "ADMIN") {
        //   throw new GraphQLError(
        //     "Unauthorized - You don't have permission to delete this user",
        //     {
        //       extensions: { code: "FORBIDDEN" },
        //     }
        //   );
        // }

        // Input validation
        if (!user_id) {
          throw new GraphQLError("User ID is required", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }

        connection = await db.getConnection();
        await connection.beginTransaction();

        // Check if user exists and isn't already deleted
        const [user] = await getUsers({ id: user_id, limit: 1 });

        if (!user) {
          throw new GraphQLError("User not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        if (user.deleted) {
          throw new GraphQLError("User is already deleted", {
            extensions: { code: "CONFLICT" },
          });
        }

        // Perform soft delete
        await saveData({
          table: "users",
          data: {
            deleted: true, // or new Date() if your column is a timestamp
            updated_at: new Date(),
            // Optionally, you might want to clear sensitive data:
            // email: `deleted_${user.email}`,
            // password_hash: null
          },
          id: user_id,
          connection: connection,
        });

        await connection.commit();

        return {
          success: true,
          message: "User account deactivated successfully",
        };
      } catch (error) {
        if (connection) {
          await connection.rollback();
        }

        if (error instanceof GraphQLError) {
          throw error;
        }

        console.error("User deletion error:", error);
        throw new GraphQLError("Failed to deactivate user account", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      } finally {
        if (connection) {
          connection.release();
        }
      }
    },
  },
};

export default userResolvers;
