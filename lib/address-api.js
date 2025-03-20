import api from './api';

export const getAddressList = async (params = {}) => {
  try {
    const { address_type, sort = 'created_at', order = 'desc' } = params;
    const queryParams = new URLSearchParams();
    
    if (address_type) queryParams.append('address_type', address_type);
    if (sort) queryParams.append('sort', sort);
    if (order) queryParams.append('order', order);
    
    const response = await api.get(`/address/address/?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createAddress = async (addressData) => {
  try {
    const response = await api.post('/address/address/', addressData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAddressDetail = async (addressId) => {
  try {
    const response = await api.get(`/address/address/${addressId}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateAddress = async (addressId, addressData) => {
  try {
    const response = await api.put(`/address/address/${addressId}/`, addressData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteAddress = async (addressId) => {
  try {
    const response = await api.delete(`/address/address/${addressId}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};