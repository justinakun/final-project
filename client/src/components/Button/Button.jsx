import PropTypes from "prop-types";
import "./Button.scss";

const Button = ({ className, children, ...props }) => {
  return (
    <button className={`styled-button ${className}`} {...props}>
      {children}
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Button;
