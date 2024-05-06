export interface AuthenticationResponseModel {
  isAuthSuccessful: boolean;
  errorMessage: string;
  token: string;
}
