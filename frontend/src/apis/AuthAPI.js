import * as authService from "~/services/authService";

export const AuthAPI = {
  login: async ({ email, password }) => {
    const result = await authService.login({ email, password });
    return result;
  },

  refreshToken: async () => {
    const result = await authService.refreshToken();
    return result;
  },

  logout: async () => {
    const result = await authService.logout();
    return result;
  },

  register: async ({ fullName, email, password, phoneNumber }) => {
    const result = await authService.register({ fullName, email, password, phoneNumber });
    return result;
  },

  verifyOtp: async ({ email, otp }) => {
    const result = await authService.verifyOtp({ email, otp });
    return result;
  },

  forgotPassword: async ({ email }) => {
    const result = await authService.forgotPassword({ email });
    return result;
  },

  verifyForgotOtp: async ({ email, otp }) => {
    const result = await authService.verifyForgotOtp({ email, otp });
    return result;
  },

  resetPassword: async ({ email, newPassword }) => {
    const result = await authService.resetPassword({ email, newPassword });
    return result;
  },
};
