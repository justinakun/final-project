import "./LoginLayout.scss";

const LoginLayout = ({ children }) => {
  return (
    <div className="login-container">
      <h1 className="big-title">chat away...</h1>
      {children}
    </div>
  );
};

export default LoginLayout;
