import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import Button from "../../components/Button/Button";
import { LOGIN_ROUTE } from "../../routes/const";
import Alert from "../../components/Alert/Alert";
import "./Register.scss";

const Register = () => {
  const { handleRegister } = useContext(UserContext);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      name,
      surname,
      email,
      age: parseInt(age),
      password,
    };
    handleRegister(user, setMessage);
  };

  return (
    <div>
      {message && <Alert title={message} className="error" />}
      <form className="form" onSubmit={handleSubmit}>
        <div className="input-item">
          <label htmlFor="name" className="input-lable">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="input-item">
          <label htmlFor="surname" className="input-label">
            Surname
          </label>
          <input
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />
        </div>
        <div className="input-item">
          <lable htmlFor="email" className="input-label">
            Email
          </lable>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-item">
          <lable htmlFor="age" className="input-lable">
            Age
          </lable>
          <input
            className="age-input-field"
            type="number"
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value))}
            required
          />
        </div>
        <div className="input-item">
          <lable htmlFor="password" className="input-label">
            Password
          </lable>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="button-container">
          <Button>Register</Button>
          <Link to={LOGIN_ROUTE} className="to-login-link">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
