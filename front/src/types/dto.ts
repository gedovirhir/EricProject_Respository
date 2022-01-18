export interface AuthDTO {
    login: string;
    password: string;
    code?: string | undefined;
    isAdmin?: boolean;
    message?: string | undefined;
}

export interface SignOutDTO {
    code: number;
    message: string;
}

export interface SendRequestsToBuyDto {
  status: number;
  message: string;
}