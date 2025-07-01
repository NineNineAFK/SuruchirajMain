const API_BASE_URL = import.meta.env.VITE_domainName;

export interface Address {
  _id: string;
  addressName: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddressFormData {
  addressName: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

// Get all addresses for the current user
export const getAddresses = async (): Promise<Address[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/addresses`, {
      method: 'GET',
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch addresses');
    }

    return data.addresses;
  } catch (error) {
    console.error('Error fetching addresses:', error);
    throw error;
  }
};

// Get a specific address
export const getAddress = async (addressId: string): Promise<Address> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/addresses/${addressId}`, {
      method: 'GET',
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch address');
    }

    return data.address;
  } catch (error) {
    console.error('Error fetching address:', error);
    throw error;
  }
};

// Add a new address
export const addAddress = async (addressData: AddressFormData): Promise<Address> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(addressData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to add address');
    }

    return data.address;
  } catch (error) {
    console.error('Error adding address:', error);
    throw error;
  }
};

// Update an address
export const updateAddress = async (addressId: string, addressData: Partial<AddressFormData>): Promise<Address> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/addresses/${addressId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(addressData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update address');
    }

    return data.address;
  } catch (error) {
    console.error('Error updating address:', error);
    throw error;
  }
};

// Delete an address
export const deleteAddress = async (addressId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/addresses/${addressId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete address');
    }
  } catch (error) {
    console.error('Error deleting address:', error);
    throw error;
  }
};

// Set default address
export const setDefaultAddress = async (addressId: string): Promise<Address> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/addresses/${addressId}/default`, {
      method: 'PATCH',
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to set default address');
    }

    return data.address;
  } catch (error) {
    console.error('Error setting default address:', error);
    throw error;
  }
}; 