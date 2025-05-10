import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/db";
import { generateToken } from "../utils/auth";
import { loginSchema, registerSchema } from "../validators/authValidator";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = loginSchema.parse(req.body);

    // Find user by email in the database
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare provided password with hashed password in DB
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user.id);

    res.json({ token });
  } catch (error) {
    next(error);
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = registerSchema.parse(req.body);

    // Check if email is already registered
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash the password before saving to database
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create new user in database
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

  // Find user by id and only select id and email (no password)
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true },
  });

  res.json(user);
};
