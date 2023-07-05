import axios from "axios";

// register a new user
export const createUser = async (newUser) => {
  const response = await axios.post("http://localhost:3000/register", newUser);
  return response.data;
};

// log the user in
export const postLogin = async (user) => {
  const response = await axios.post("http://localhost:3000/login", user);
  return response.data;
};

export const updateUser = async (id, updatingUser) => {
  const response = await axios.put(
    `http://localhost:3000/users/${id}`,
    updatingUser
  );
  return response.data;
};
