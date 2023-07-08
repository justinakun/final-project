import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import Button from "../../components/Button/Button";
import { REGISTER_ROUTE } from "../../routes/const";
import Alert from "../../components/Alert/Alert";
import "./Login.scss";

const Login = () => {
  const { handleLogin } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = { email, password };
    handleLogin(user, setError);
  };

  return (
    <div className="login-container">
      {error && <Alert title={error} className="error" />}
      <form className="form" onSubmit={handleSubmit}>
        <div className="input-item">
          <label htmlFor="email" className="input-label">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-item">
          <label className="input-label" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="button-container">
          <Button>Login</Button>
          <Link to={REGISTER_ROUTE} className="register-link">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
