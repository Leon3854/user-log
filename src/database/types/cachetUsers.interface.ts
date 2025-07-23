import { User } from "./users.interface";

export interface CachedUsers {
  seeded: boolean;
  data?: User[];
}
