export type AuthContextType = {
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticating: boolean;
  isRegistering: boolean;
  user: any;
  isEditMode: boolean;
  handleChangeMode: (value:boolean) => Promise<void>
};
