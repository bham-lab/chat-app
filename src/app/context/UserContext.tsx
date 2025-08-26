import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  _id: string;
  name: string;
  email?: string;
}

const UserContext = createContext<{ user: User | null; setUser: (u: User) => void }>({
  user: null,
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
