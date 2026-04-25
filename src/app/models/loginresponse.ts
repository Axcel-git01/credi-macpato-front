import { UserResponseDTO } from "./userresponse";

export interface LoginResponseDTO {
  user: UserResponseDTO;
  token: string;
}