import Topbar from "../components/Topbar/Topbar";
import Footer from "../components/Footer/Footer";
import PropTypes from "prop-types";
import "./AuthenticatedLayout.scss";

const AuthenticatedLayout = ({ children }) => {
  return (
    <div className="content">
      <div className="page-wrapper">
        <Topbar />
        <div className="authenticated-container">{children}</div>
      </div>
      <Footer className="footer" />
    </div>
  );
};

AuthenticatedLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthenticatedLayout;
