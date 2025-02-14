import { z } from "zod";
import { Request, Response } from "express";
import { RegisterUseCase } from "@/use-cases/users/register";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";

const registerBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export const register = async (request: Request, response: Response): Promise<Response> => {
  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const usersRepository = new PrismaUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name,
      email,
      password,
      });

    return response.status(201).json({
      user,
    });

  } catch (error) {
    if (error instanceof Error) {
      return response.status(400).json({
        message: error.message,
      });
    }

    return response.status(400).json({
      message: "User already exists.",
    });
  }
};