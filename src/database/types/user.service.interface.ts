import { User } from "./users.interface";

export interface IUserService {
  getById(id: number): Promise<User | null>;
  create(userData: Omit<User, "id">): Promise<User>;
  update(id: number, userData: Partial<User>): Promise<User>;
  delete(id: number): Promise<void>;
  getAll(): Promise<User[]>;
}
