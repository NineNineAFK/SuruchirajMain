// src/pages/user/Profile.tsx
import React, { useState, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userInfoAtom } from '../../state/state';
import { userApi } from '../../api/userApi';
import { toast } from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  photo?: string;
  profilePicture?: string;
  dateOfBirth?: string;
  gender?: string;
}

interface Address {
  _id: string;
  addressName: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

const Profile: React.FC = () => {
  const user = useRecoilValue(userInfoAtom);
  const setUserInfo = useSetRecoilState(userInfoAtom);
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user.name || '',
    phone: user.phone || '',
    dateOfBirth: user.dateOfBirth || '',
    gender: user.gender || ''
  });

  // Address form state
  const [addressData, setAddressData] = useState({
    addressName: '',
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: ''
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await userApi.getAddresses();
      setAddresses(response.addresses);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Failed to load addresses');
    }
  };

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await userApi.updateProfile(profileData);
      setUserInfo(response.user);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePictureUpdate = async (imageUrl: string) => {
    try {
      const response = await userApi.updateProfilePicture(imageUrl);
      setUserInfo(response.user);
      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Error updating profile picture:', error);
      toast.error('Failed to update profile picture');
    }
  };

  const handleAddAddress = async () => {
    setIsLoading(true);
    try {
      await userApi.addAddress(addressData);
      setAddressData({
        addressName: '',
        name: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: ''
      });
      setShowAddAddress(false);
      fetchAddresses();
      toast.success('Address added successfully');
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('Failed to add address');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAddress = async () => {
    if (!editingAddress) return;
    
    setIsLoading(true);
    try {
      await userApi.updateAddress(editingAddress._id, addressData);
      setEditingAddress(null);
      setAddressData({
        addressName: '',
        name: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: ''
      });
      fetchAddresses();
      toast.success('Address updated successfully');
    } catch (error) {
      console.error('Error updating address:', error);
      toast.error('Failed to update address');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    
    try {
      await userApi.deleteAddress(addressId);
      fetchAddresses();
      toast.success('Address deleted successfully');
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    }
  };

  const startEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressData({
      addressName: address.addressName,
      name: address.name,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      pincode: address.pincode
    });
  };

  const cancelEdit = () => {
    setEditingAddress(null);
    setShowAddAddress(false);
    setAddressData({
      addressName: '',
      name: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: ''
    });
  };

  return (
    <div className="min-h-screen bg-[#4D6A3F]/10 text-black dark:bg-black dark:text-white">
      <div className="max-w-6xl mx-auto py-10 px-4">
        <h1 className="text-4xl font-bold mb-6 font-heading dark:text-white text-black">My Profile</h1>
        
        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6 font-body">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'profile'
                ? 'dark:bg-yellow-500 bg-[#4D6A3F] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-white/10 dark:text-white dark:hover:bg-white/20'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'addresses'
                ? 'dark:bg-yellow-500 bg-[#4D6A3F] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-white/10 dark:text-white dark:hover:bg-white/20'
            }`}
          >
            Addresses
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-gray-100 dark:bg-black p-6 rounded-xl shadow-lg space-y-6">
            {/* Profile Picture Section */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={user.profilePicture || user.photo || '/user.png'}
                  alt="Profile"
                  className="w-16 h-16 md:w-24 md:h-24 rounded-full object-cover"
                />
                <button
                  onClick={() => {
                    const imageUrl = prompt('Enter image URL:');
                    if (imageUrl) handleProfilePictureUpdate(imageUrl);
                  }}
                  className="absolute bottom-0 right-0 dark:bg-yellow-500 bg-[#4D6A3F] text-white p-2 rounded-full hover:bg-yellow-700 transition-colors"
                >
                  <svg className="w-2 h-2 md:h-4 md:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
              <div>
                <h2 className="text-xl md:text-3xl font-semibold font-heading dark:text-gray-200 text-black">{user.name}</h2>
                <p className="dark:text-gray-200 text-black font-sans">{user.email}</p>
              </div>
            </div>

            {/* Profile Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-body">
              <div>
                <label className="block text-sm font-semibold mb-2 dark:text-gray-200 text-black">Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  disabled={!isEditing}
                   className="w-full px-3 py-2 bg-white dark:bg-black border border-black dark:border-white rounded-lg text-black dark:text-white disabled:opacity-80 focus:outline-none focus:ring-2 focus:ring-[#4D6A3F] dark:focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 dark:text-gray-200 text-black">Phone</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-white dark:bg-black border border-black dark:border-white rounded-lg text-black dark:text-white disabled:opacity-80 focus:outline-none focus:ring-2 focus:ring-[#4D6A3F] dark:focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 dark:text-gray-200 text-black">Date of Birth</label>
                <input
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-white dark:bg-black border border-black dark:border-white rounded-lg text-black dark:text-white disabled:opacity-80 focus:outline-none focus:ring-2 focus:ring-[#4D6A3F] dark:focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 dark:text-gray-200 text-black">Gender</label>
                <select
                  value={profileData.gender}
                  onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2.5 bg-white dark:bg-black border border-black dark:border-white rounded-lg text-black dark:text-white disabled:opacity-80 focus:outline-none focus:ring-2 focus:ring-[#4D6A3F] dark:focus:ring-yellow-500"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 dark:bg-yellow-500 bg-[#4D6A3F] text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleProfileUpdate}
                    disabled={isLoading}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setProfileData({
                        name: user.name || '',
                        phone: user.phone || '',
                        dateOfBirth: user.dateOfBirth || '',
                        gender: user.gender || ''
                      });
                    }}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="space-y-6 bg-gray-100 dark:bg-black p-6 rounded-xl font-body">
            {/* Add Address Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold font-heading dark:text-white text-black">My Addresses</h2>
              <button
                onClick={() => setShowAddAddress(true)}
                className="px-4 py-2 dark:bg-yellow-500 bg-[#4D6A3F] text-white rounded-lg dark:hover:bg-yellow-600 hover:bg-[#4D6A3F]/80 transition-colors"
              >
                Add New Address
              </button>
            </div>

            {/* Address List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-body">
              {addresses.map((address) => (
                <div key={address._id} className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-md border border-black/10 dark:border-white/10">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg dark:text-white text-black">{address.addressName}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditAddress(address)}
                        className="dark:text-yellow-400 text-[#4D6A3F] dark:hover:text-yellow-500 hover:text-[#4D6A3F]/80 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(address._id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="dark:text-white text-black font-medium">{address.name}</p>
                    <p className="dark:text-white text-black font-sans">{address.phone}</p>
                    <p className="dark:text-white text-black">{address.addressLine1}</p>
                    {address.addressLine2 && <p className="dark:text-white text-black">{address.addressLine2}</p>}
                    <p className="dark:text-white text-black">{address.city}, {address.state} - {address.pincode}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add/Edit Address Form */}
            {(showAddAddress || editingAddress) && (
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg border border-black/10 dark:border-white/10">
                <h3 className="text-xl font-semibold mb-4 dark:text-white text-black">
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200 text-black">Address Name</label>
                    <input
                      type="text"
                      value={addressData.addressName}
                      onChange={(e) => setAddressData({ ...addressData, addressName: e.target.value })}
                      placeholder="e.g., Home, Office"
                      className="w-full px-3 py-2 bg-white dark:bg-black border border-black dark:border-white rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4D6A3F] dark:focus:ring-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200 text-black">Full Name</label>
                    <input
                      type="text"
                      value={addressData.name}
                      onChange={(e) => setAddressData({ ...addressData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-black border border-black dark:border-white rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4D6A3F] dark:focus:ring-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200 text-black">Phone</label>
                    <input
                      type="tel"
                      value={addressData.phone}
                      onChange={(e) => setAddressData({ ...addressData, phone: e.target.value })}
                      className="w-full px-3 py-2 font-sans bg-white dark:bg-black border border-black dark:border-white rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4D6A3F] dark:focus:ring-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200 text-black">Address Line 1</label>
                    <input
                      type="text"
                      value={addressData.addressLine1}
                      onChange={(e) => setAddressData({ ...addressData, addressLine1: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-black border border-black dark:border-white rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4D6A3F] dark:focus:ring-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200 text-black">Address Line 2 (Optional)</label>
                    <input
                      type="text"
                      value={addressData.addressLine2}
                      onChange={(e) => setAddressData({ ...addressData, addressLine2: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-black border border-black dark:border-white rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4D6A3F] dark:focus:ring-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200 text-black">City</label>
                    <input
                      type="text"
                      value={addressData.city}
                      onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-black border border-black dark:border-white rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4D6A3F] dark:focus:ring-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200 text-black">State</label>
                    <input
                      type="text"
                      value={addressData.state}
                      onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-black border border-black dark:border-white rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4D6A3F] dark:focus:ring-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200 text-black">Pincode</label>
                    <input
                      type="text"
                      value={addressData.pincode}
                      onChange={(e) => setAddressData({ ...addressData, pincode: e.target.value })}
                      className="w-full px-3 py-2 font-sans bg-white dark:bg-black border border-black dark:border-white rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4D6A3F] dark:focus:ring-yellow-500"
                    />
                  </div>
                </div>
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={editingAddress ? handleUpdateAddress : handleAddAddress}
                    disabled={isLoading}
                    className="px-6 py-2 dark:bg-yellow-500 bg-[#4D6A3F] text-white rounded-lg dark:hover:bg-yellow-600 hover:bg-[#4D6A3F]/80 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : (editingAddress ? 'Update Address' : 'Add Address')}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
