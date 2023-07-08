import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { MAIN_ROUTE, PROFILE_ROUTE } from "../../routes/const";
import { FiLogOut } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { AiOutlineHome } from "react-icons/ai";
import "./Topbar.scss";

const Topbar = () => {
  const { handleLogout } = useContext(UserContext);

  return (
    <nav className="navigation">
      <div className="nav-start-items">
        <Link to={MAIN_ROUTE}>
          <AiOutlineHome className="nav-item" />
        </Link>
      </div>
      <div className="nav-mid-items">
        <h1 className="logo">chat away...</h1>
      </div>
      <div className="nav-end-items">
        <Link to={PROFILE_ROUTE} className="user-container">
          <CgProfile className="nav-item" />
        </Link>
        <FiLogOut onClick={handleLogout} className="nav-item log-out-item" />
      </div>
    </nav>
  );
};

export default Topbar;
