import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOGIN_ROUTE } from "../routes/const";
import { postLogin, createUser } from "../api/users";
import PropTypes from "prop-types";

const UserContext = createContext({
  user: null,
  isLoggedIn: false,
  handleLogin: () => null,
  handleLogout: () => null,
  handleRegister: () => null,
  handleUpdateUser: () => null,
});

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const isLoggedIn = !!user;
  const navigate = useNavigate();

  const handleRegister = (newUser, setMessage) => {
    createUser(newUser)
      .then((response) => {
        if (
          response === "Username already exists" ||
          response === "Email already exists"
        ) {
          setMessage(response);
        } else {
          navigate(LOGIN_ROUTE);
          alert("You have been successfully registered");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleLogin = (user, setError) => {
    postLogin(user)
      .then((response) => {
        if (
          response === "User doesn't exist" ||
          response === "Password doesn't match the email"
        ) {
          setError(response);
        } else {
          localStorage.setItem("user", JSON.stringify(response));
          setUser(response);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.setItem("user", null);
    navigate(LOGIN_ROUTE);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoggedIn,
        handleLogin,
        handleLogout,
        handleRegister,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { UserContext, UserProvider };
