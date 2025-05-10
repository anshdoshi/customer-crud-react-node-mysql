import { Request, Response } from "express";
import { prisma } from "../config/db";
import { customerSchema } from "../validators/customerValidator";

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const data = customerSchema.parse(req.body);

    // Insert customer into the database
    const customer = await prisma.customer.create({ data });

    res.json(customer);
  } catch {
    res.status(400).json({ message: "Invalid data" });
  }
};

export const getCustomers = async (req: Request, res: Response) => {
  try {
    // Get query parameters or set default values
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const search = (req.query.search as string) || "";

    // Calculate how many records to skip
    const skip = (page - 1) * limit;

    // Build search condition if search term is provided
    const whereCondition = search
      ? {
          OR: [{ name: { contains: search } }, { phone: { contains: search } }],
        }
      : {};

    // Run both queries in parallel:
    // - get paginated customer list
    // - get total customer count
    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where: whereCondition,
        skip,
        take: limit,
        select: { id: true, name: true, phone: true, address: true },
        orderBy: { id: "asc" },
      }),
      prisma.customer.count({ where: whereCondition }),
    ]);

    // Calculate last page number
    const lastPage = Math.ceil(total / limit);

    res.json({
      customers,
      total,
      page,
      lastPage,
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    // Validate request body
    const data = customerSchema.parse(req.body);

    // Update customer in the database
    const customer = await prisma.customer.update({
      where: { id },
      data,
    });

    res.json(customer);
  } catch {
    res.status(400).json({ message: "Invalid data or customer not found" });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    // Delete customer from the database
    await prisma.customer.delete({ where: { id } });

    res.json({ message: "Customer deleted" });
  } catch {
    res.status(400).json({ message: "Customer not found" });
  }
};
