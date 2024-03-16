import axios from "axios";

const apiUrl = "https://localhost:7222/api"||process.env.REACT_APP_API_URL;


export const login = async (user) => {
  try {    
    const { data } = await axios.post(`${apiUrl}/users/login`, user);
    return data;
  } catch (error) {
    return Promise.reject(error.message);
  }
};

export const signup = async (normalizedUser) => {
  try {
    const { data } = await axios.post(`${apiUrl}/users`, normalizedUser);
    return data;
  } catch (error) {
    return Promise.reject(error.message);
  }
};

export const getUserData = async (id) => {
  try {
    const { data } = await axios.get(`${apiUrl}/users/${id}`);
    return data;
  } catch (error) {
    return Promise.reject(error.message);
  }
};

export const updateUser = async (Id, updatedUser) => {
  try {
    const { data } = await axios.put(`${apiUrl}/users/${Id}`, updatedUser);
    return data;
  } catch (error) {
    return Promise.reject(error.message);
  }
};