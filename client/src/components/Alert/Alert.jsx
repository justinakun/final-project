import "./Alert.scss";
import PropTypes from "prop-types";

const Alert = ({ title }) => {
  return <div className="alert">{title}</div>;
};

Alert.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Alert;
