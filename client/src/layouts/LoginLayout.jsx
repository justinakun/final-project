import PropTypes from "prop-types";
import "./LoginLayout.scss";

const LoginLayout = ({ children }) => {
  return (
    <div className="login-container">
      <h1 className="big-title">chat away...</h1>
      {children}
    </div>
  );
};

LoginLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LoginLayout;
