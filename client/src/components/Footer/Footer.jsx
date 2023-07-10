import PropTypes from "prop-types";

const Footer = ({ className }) => {
  return (
    <div className={className}>© 2023 Chat Away | All Rights Reserved</div>
  );
};

Footer.propTypes = {
  className: PropTypes.string,
};

export default Footer;
