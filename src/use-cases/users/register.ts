import { prisma } from "@/lib/prisma";
import { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";

type RegisterUseCaseRequest = {
  name: string;
  email: string;
  password: string;
};

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const passwordHash = await hash(password, 10);
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new Error("User already exists.");
    }

    const user = await this.usersRepository.create({
      name: name,
      email: email,
      password: passwordHash,
    });

    return { user };
  }
}
