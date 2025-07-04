import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_domainName;

// User Profile API
export const userApi = {
  // Get user profile
  getProfile: async () => {
    const response = await axios.get(`${API_BASE_URL}/user/profile`, {
      withCredentials: true
    });
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData: {
    name?: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
  }) => {
    const response = await axios.put(`${API_BASE_URL}/user/profile`, profileData, {
      withCredentials: true
    });
    return response.data;
  },

  // Update profile picture
  updateProfilePicture: async (profilePicture: string) => {
    const response = await axios.put(`${API_BASE_URL}/user/profile-picture`, { profilePicture }, {
      withCredentials: true
    });
    return response.data;
  },

  // Get user addresses
  getAddresses: async () => {
    const response = await axios.get(`${API_BASE_URL}/user/addresses`, {
      withCredentials: true
    });
    return response.data;
  },

  // Add new address
  addAddress: async (addressData: {
    addressName: string;
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  }) => {
    const response = await axios.post(`${API_BASE_URL}/user/addresses`, addressData, {
      withCredentials: true
    });
    return response.data;
  },

  // Update address
  updateAddress: async (addressId: string, addressData: {
    addressName: string;
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  }) => {
    const response = await axios.put(`${API_BASE_URL}/user/addresses/${addressId}`, addressData, {
      withCredentials: true
    });
    return response.data;
  },

  // Delete address
  deleteAddress: async (addressId: string) => {
    const response = await axios.delete(`${API_BASE_URL}/user/addresses/${addressId}`, {
      withCredentials: true
    });
    return response.data;
  },

  // Get user orders
  getOrders: async () => {
    const response = await axios.get(`${API_BASE_URL}/user/orders`, {
      withCredentials: true
    });
    return response.data;
  },

  // Get specific order details
  getOrderDetails: async (orderId: string) => {
    const response = await axios.get(`${API_BASE_URL}/user/orders/${orderId}`, {
      withCredentials: true
    });
    return response.data;
  },

  // --- Wishlist APIs ---
  getWishlist: async () => {
    const response = await axios.get(`${API_BASE_URL}/user/wishlist`, { withCredentials: true });
    return response.data;
  },
  addToWishlist: async (productId: string) => {
    const response = await axios.post(`${API_BASE_URL}/user/wishlist/${productId}`, {}, { withCredentials: true });
    return response.data;
  },
  removeFromWishlist: async (productId: string) => {
    const response = await axios.delete(`${API_BASE_URL}/user/wishlist/${productId}`, { withCredentials: true });
    return response.data;
  },
  moveWishlistItemToCart: async (productId: string) => {
    const response = await axios.post(`${API_BASE_URL}/user/wishlist/move-to-cart/${productId}`, {}, { withCredentials: true });
    return response.data;
  }
};

export default userApi; 