// all good

import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import Button from "../../components/Button/Button";
import FormItem from "../../components/FormItem/FormItem";
import { LOGIN_ROUTE } from "../../routes/const";
import Alert from "../../components/Alert/Alert";
import "../Login/Login.scss";

const Register = () => {
  const { handleRegister } = useContext(UserContext);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      name,
      surname,
      username,
      email,
      age: parseInt(age),
      password,
    };
    handleRegister(user, setMessage);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      {message && <Alert message={message} />}
      <FormItem
        label="Name"
        containerClassname="form-item"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <FormItem
        label="Surname"
        containerClassname="form-item"
        type="text"
        value={surname}
        onChange={(e) => setSurname(e.target.value)}
        required
      />
      <FormItem
        label="Username"
        containerClassname="form-item"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <FormItem
        label="Email"
        containerClassname="form-item"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <FormItem
        label="Age"
        containerClassname="form-item"
        type="number"
        value={age}
        onChange={(e) => setAge(parseInt(e.target.value))}
        required
      />
      <FormItem
        label="Password"
        containerClassname="form-item"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <div className="button-container">
        <Button>Register</Button>
        <Link to={LOGIN_ROUTE}>Back to Login</Link>
      </div>
    </form>
  );
};

export default Register;
