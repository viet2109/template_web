import { FC } from "react";

export interface Route {
  path: string;
  page: FC<any>;
  layout?: FC<any>;
}

export interface User {
  name: string;
  email: string;
}

export interface UserLoginResponse {
  user: User;
  token: string;
}
