import { UserAdmin } from "@/entities/types";
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

interface Auth {
  token: string;
  admin: UserAdmin;
  isLogged: (data: UserAdmin, token: string) => void;
  isLogout: () => void;
  isAuthenticed: boolean;
  updateProfil: (newProfileUrl: string) => void;
}

export const useAuthStore = create<Auth>()(
  devtools(
    persist(
      (set) => ({
        token: "",
        admin: {
          id: "",
          fullname: "",
          email: "",
          password: "",
          role: "ADMIN",
          createdAt: new Date(),
          isAuthenticed: false,
        },
        isAuthenticed: false,
        isLogged(data, token) {
          set({
            token: token,
            admin: {
              ...data,
            },
            isAuthenticed: true,
          });
        },
        isLogout() {
          set({
            token: "",
            admin: {
              id: "",
              fullname: "",
              email: "",
              password: "",
              role: "ADMIN",
              createdAt: new Date(),
            },
            isAuthenticed: false,
          });
        },
        updateProfil(newProfileUrl) {
          set((state) => ({
            admin: {
              ...state.admin,
              image: newProfileUrl,
            },
          }));
        },
      }),
      {
        name: "@user-auth", // name of the item in the storage (must be unique)
      }
    )
  )
);
