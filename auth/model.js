import pool from "../config/database.js";

export default class User {
  static async findByEmail(email) {
    try {
      const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  static async create({ name, email, password, phone, organization, plan }) {
    try {
      const [result] = await pool.query(
        "INSERT INTO users (name, email, password, phone, organization, plan) VALUES (?, ?, ?, ?, ?, ?)",
        [name, email, password, phone, organization, plan]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async updatePassword(id, hashedPassword) {
    try {
      await pool.query(
        "UPDATE users SET password = ? WHERE id = ?",
        [hashedPassword, id]
      );
    } catch (error) {
      throw error;
    }
  }

  static async updateProfile(id, { name, phone, organization }) {
    try {
      const [result] = await pool.query(
        "UPDATE users SET name = ?, phone = ?, organization = ? WHERE id = ?",
        [name, phone, organization, id]
      );
      
      if (result.affectedRows === 0) {
        throw new Error('User not found');
      }
      
      return await User.findById(id);
    } catch (error) {
      throw error;
    }
  }
}