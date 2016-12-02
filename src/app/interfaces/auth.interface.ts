export interface IAuthRequest {
  username: string;
  password: string;
}

export interface IAuthResponse {
  xossessionid: string;
  xoscsrftoken: string;
  user: string;
}
