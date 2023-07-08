import "./Alert.scss";
import PropTypes from "prop-types";

const Alert = ({ title, className }) => {
  return <div className={`alert ${className}`}>{title}</div>;
};

Alert.propTypes = {
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default Alert;
