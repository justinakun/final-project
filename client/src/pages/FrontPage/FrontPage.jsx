import { Link } from "react-router-dom";
import { LOGIN_ROUTE, REGISTER_ROUTE } from "../../routes/const";
import "./FrontPage.scss";

const FrontPage = () => {
  return (
    <div>
      <div>
        <h1>chatty_</h1>
      </div>
      <div>
        <Link to={LOGIN_ROUTE}>Login</Link>
        <Link to={REGISTER_ROUTE}>Register</Link>
      </div>
    </div>
  );
};

export default FrontPage;
