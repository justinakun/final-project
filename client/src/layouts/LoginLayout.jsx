const LoginLayout = ({ children }) => {
  return (
    <div className="login-container">
      <h1>Welcome to Chatty!</h1>
      {children}
    </div>
  );
};

export default LoginLayout;
