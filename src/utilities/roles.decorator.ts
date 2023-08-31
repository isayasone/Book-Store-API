import { SetMetadata } from "@nestjs/common";
import { User_Role } from "@prisma/client";


export const Roles = (...roles: User_Role[]) => SetMetadata("roles", roles);