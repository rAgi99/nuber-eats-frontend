/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LoginInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: loginMutaion
// ====================================================

export interface loginMutaion_login {
  __typename: "LoginOutput";
  ok: boolean;
  token: string | null;
  error: string | null;
}

export interface loginMutaion {
  login: loginMutaion_login;
}

export interface loginMutaionVariables {
  loginInput: LoginInput;
}
