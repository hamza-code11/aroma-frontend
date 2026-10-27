export const getRedirectPathByRole = (role?: string | null): string => {
  return role === 'admin' ? '/admin' : '/';
};
