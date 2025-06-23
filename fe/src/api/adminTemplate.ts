import { AxiosResponse } from "axios";
import {
  AdminTemplateDto,
  Category,
  Color,
  Page,
  Pageable,
  TemplateStatus
} from "../types";
import { api } from "./api";

export interface GetTemplateParams extends Pageable {
  keyword?: string;
  category?: Category;
  colors?: Color[]; // Set<Color> → Color[]
  minPrice?: string; // hoặc number nếu bạn đảm bảo BE dùng đúng
  maxPrice?: string;
  isFree?: boolean;
  templateStatus?: TemplateStatus;
  createdAfter?: string; // ISO datetime string, ví dụ "2025-06-23T10:00:00"
  createdBefore?: string;
  sellerName?: string;
}

export async function fetchAdminTemplate(
  params: GetTemplateParams
): Promise<Page<AdminTemplateDto>> {
  try {
    const response: AxiosResponse<Page<AdminTemplateDto>> = await api.get(
      "/admin/templates",
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
