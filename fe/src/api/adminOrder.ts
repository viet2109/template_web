import { AxiosResponse } from "axios";
import {
  AdminOrderAnalyticsDto,
  AdminOrderDto,
  OrderStatus,
  Page,
  Pageable,
  PaymentMethod,
  PaymentStatus,
} from "../types";
import { api } from "./api";

export interface GetOrdersParams extends Pageable {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  createdFrom?: string;
  createdTo?: string;
  min?: number;
  max?: number;
}

// export const fetchAdminOrders = async (avatarFileId: number): Promise<User> => {
//   try {
//     const response = await api.put(`/profile/avatar`, { avatarFileId });
//     return response.data;
//   } catch (error: any) {
//     return Promise.reject(error);
//   }
// };

export async function fetchAdminOrders(
  params: GetOrdersParams
): Promise<Page<AdminOrderDto>> {
  try {
    const response: AxiosResponse<Page<AdminOrderDto>> = await api.get(
      "/admin/orders",
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

export async function fetchAnalytic(
): Promise<AdminOrderAnalyticsDto> {
  try {
    const response: AxiosResponse<AdminOrderAnalyticsDto> = await api.get(
      "/admin/orders/analytics"
    );
    return response.data;
  } catch (error: any) {
    return Promise.reject(error);
  }
}
