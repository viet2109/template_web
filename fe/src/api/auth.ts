import { CodeResponse } from "@react-oauth/google";
import { AxiosResponse } from "axios";
import { AuthenticationResponse } from "../types";
import { api } from "./api";

export async function loginWithGoogle(
  token: CodeResponse,
  redirectUri: string
): Promise<AuthenticationResponse> {
  try {
    const response: AxiosResponse<AuthenticationResponse> = await api.post(
      "/auth/login/google",
      {
        code: token.code,
        redirect_uri: redirectUri,
      }
    );
    return response.data;
  } catch (error: any) {
    return Promise.reject(error);
  }
}
interface LoginCredentials {
  email: string;
  password: string;
}

export async function loginUser(
 credentials: LoginCredentials
): Promise<AuthenticationResponse> {
   try {
    const response: AxiosResponse<AuthenticationResponse> = await api.post(
      "/auth/login",
      credentials
    );
    return response.data;
  } catch (error: any) {
    return Promise.reject(error);
  }
}
