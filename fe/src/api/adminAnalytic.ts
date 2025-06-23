import { AxiosResponse } from "axios";
import {
  AdminDashboardDto,
  AdminOrderDto,
  OrderStatus,
  Page,
  Pageable,
  PaymentMethod,
  PaymentStatus,
  RevenueByCategoryDto,
  RevenueByCategoryParams,
  RevenueByPeriodDto,
  RevenueByPeriodParams,
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

export async function fetchRevenueByPeriod(
  params: RevenueByPeriodParams
): Promise<RevenueByPeriodDto[]> {
  try {
    const response: AxiosResponse<RevenueByPeriodDto[]> = await api.get(
      "/admin/analytics/revenue/period",
      {
        params: {
          ...params,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return Promise.reject(error);
  }
}

export async function fetchRevenueByCategory(
  params: RevenueByCategoryParams
): Promise<RevenueByCategoryDto[]> {
  try {
    const response: AxiosResponse<RevenueByCategoryDto[]> = await api.get(
      "/admin/analytics/revenue/category",
      {
        params: {
          ...params,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return Promise.reject(error);
  }
}

export async function fetchAdminDashboard(): Promise<AdminDashboardDto> {
  try {
    const response: AxiosResponse<AdminDashboardDto> = await api.get(
      "/admin/dashboard"
    );
    return response.data;
  } catch (error: any) {
    return Promise.reject(error);
  }
}
