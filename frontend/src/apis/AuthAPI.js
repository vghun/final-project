import * as authService from "~/services/authService";

export const AuthAPI = {
  login: async ({ email, password }) => {
    const result = await authService.login({ email, password });
    return result;
  },

  register: async ({ name, email, password }) => {
    const result = await authService.register({ name, email, password });
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
