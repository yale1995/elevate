import express from "express";
import { usersRoutes } from "./http/controllers/users/routes";
import { env } from "./env";

export const app = express();

app.use(express.json());
app.use(usersRoutes);



