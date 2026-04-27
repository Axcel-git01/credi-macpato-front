import {UserResponse} from './user.response';

export interface LoginRequestDTO {
  username: string;
  password: string;
}

export interface LoginResponseDTO {
  user: UserResponse;
  token: string;
}
