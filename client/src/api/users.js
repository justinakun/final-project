import axios from "axios";

export const createUser = async (newUser) => {
  const response = await axios.post("http://localhost:3000/register", newUser);
  return response.data;
};

export const postLogin = async (user) => {
  const response = await axios.post("http://localhost:3000/login", user);
  return response.data;
};
