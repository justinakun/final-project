import "./Input.css";

const Input = ({ className, ...props }) => {
  return <input className={`styled-input ${className}`} {...props} />;
};

export default Input;
