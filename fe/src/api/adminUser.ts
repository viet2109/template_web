import { AxiosResponse } from "axios";
import {
  AdminUserDto,
  Page,
  Pageable,
  Role
} from "../types";
import { api } from "./api";

export interface GetUsersParams extends Pageable {
  name?: string;
  email?: string;
  createdFrom?: string;
  createdTo?: string;
  role?: Role;
}

export async function fetchAdminUsers(
  params: GetUsersParams
): Promise<Page<AdminUserDto>> {
  try {
    const response: AxiosResponse<Page<AdminUserDto>> = await api.get(
      "/admin/users",
      {
        params: {
          ...params,
        },
        paramsSerializer: {
          indexes: null,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return Promise.reject(error);
  }
}
