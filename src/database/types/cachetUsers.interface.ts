import { User } from "./users.interface.js";

export interface CachedUsers {
  seeded: boolean;
  data?: User[];
}
