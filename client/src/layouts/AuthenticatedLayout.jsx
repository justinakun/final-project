import Topbar from "../components/Topbar/Topbar";
import Footer from "../components/Footer/Footer";
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

export default AuthenticatedLayout;
