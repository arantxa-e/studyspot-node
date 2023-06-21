import { users } from "./users";
import User from "../../src/models/user";

export const setupDatabase = async () => {
  await User.deleteMany();
  await new User(users.mockUser).save();
};
