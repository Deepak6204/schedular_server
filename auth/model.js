import pool from "../config/database.js";

export default class User {
  static async findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows.length ? rows[0] : null;
  }

  static async create({ name, email, password, phone, organization, plan }) {
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, phone, organization, plan) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, password, phone, organization, plan]
    );
    return result.insertId;
  }
}
