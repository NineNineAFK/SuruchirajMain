import { atom } from 'recoil';
import axios from 'axios';

type UserInfo = {
  name: string | null;
  email: string | null;
  photo: string | null;
  phone?: string | null;
  profilePicture?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
};

// Auth state
export const authStateAtom = atom({
  key: 'authStateAtom',
  default: null,
  effects: [
    ({ setSelf }) => {
      let ignore = false;

      const checkAuth = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_domainName}/auth/check-auth`, {
            withCredentials: true,
          });
          console.log("🔐 Auth checked:", response.data.authenticated);
          if (!ignore) setSelf(response.data.authenticated);
        } catch (error) {
          console.error("❌ Auth check failed:", error);
          if (!ignore) setSelf(null);
        }
      };

      checkAuth();

      return () => {
        ignore = true;
      };
    }
  ],
});

// User Info state
export const userInfoAtom = atom<UserInfo>({
  key: 'userInfoAtom',
  default: { name: null, email: null, photo: null },
  effects: [
    ({ setSelf }) => {
      let ignore = false;

      const getUser = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_domainName}/userinfo`, {
            withCredentials: true,
          });
          console.log("✅ User info fetched:", response.data.user);

          if (!ignore) {
            setSelf({
              name: response.data.user.name,
              email: response.data.user.email,
              photo: response.data.user.photo,
            });
          }
        } catch (error) {
          console.error("❌ Failed to fetch user info:", error);
          if (!ignore) {
            setSelf({ name: null, email: null, photo: null });
          }
        }
      };

      getUser();

      return () => {
        ignore = true;
      };
    },
  ],
});

// Dropdown visibility
export const dropDownVisibleAtom = atom({
  key: 'dropDownVisibleAtom',
  default: false,
});

// Not actively used but retained
export const loggedInUserDropDownAtom = atom({
  key: 'loggedInUserDropDownAtom',
  default: false,
});


// Search query state
export const searchQueryAtom = atom<string>({
  key: 'searchQueryAtom',
  default: '',
});

// state.tsx
export const searchTermAtom = atom<string>({
  key: 'searchTerm',
  default: '',
});