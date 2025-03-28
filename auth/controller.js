import User from "./model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

export default class AuthController {
  static async signup(req, res) {
    try {
      const { name, email, password, phone, organization, plan } = req.body;

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = await User.create({ name, email, password: hashedPassword, phone, organization, plan });

      const token = jwt.sign({ id: userId, email }, process.env.JWT_SECRET, { expiresIn: "1d" });

      res.status(201).json({ token, user: { id: userId, name, email, plan } });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET, { expiresIn: "1d" });

      res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email, plan: user.plan } });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
