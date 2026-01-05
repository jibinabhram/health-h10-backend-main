export const success = (data: any, message = 'success') => ({
  success: true,
  message,
  data,
});

export const failure = (message = 'error', errors: any = null) => ({
  success: false,
  message,
  errors,
});
