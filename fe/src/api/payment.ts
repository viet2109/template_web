import { AxiosResponse } from "axios";
import { PaymentRequestDto } from "../types";
import { api } from "./api";

export async function paymentVNPay(dto: PaymentRequestDto): Promise<string> {
  try {
    const response: AxiosResponse<string> = await api.post(
      "/payment/vnpay",
      dto
    );
    return response.data;
  } catch (error: any) {
    return Promise.reject(error);
  }
}

export async function returnPayment(params: any): Promise<any> {
  try {
    const response: AxiosResponse<any> = await api.put("/payment/vnpay", null, {
      params: { ...params },
      paramsSerializer: {
        indexes: null,
      },
    });
    return response.data;
  } catch (error: any) {
    return Promise.reject(error);
  }
}
