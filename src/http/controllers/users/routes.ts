import { Router } from "express";
import { register } from "./register";

export const usersRoutes = Router();

usersRoutes.post("/users/register", async (request, response) => {
  await register(request, response);
});
