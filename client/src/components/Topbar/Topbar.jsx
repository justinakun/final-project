import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { PROFILE_ROUTE, topbarNavigationItems } from "../../routes/const";
import "./Topbar.scss";
import Button from "../Button/Button";

const Topbar = () => {
  const { handleLogout } = useContext(UserContext);

  return (
    <nav className="navigation">
      <div>Logo</div>
      <div className="navigation-items">
        {topbarNavigationItems.map((navItem) => (
          <Link to={navItem.route} key={navItem.title}>
            {navItem.title}
          </Link>
        ))}
      </div>
      <Link to={PROFILE_ROUTE} className="user-container">
        My Profile
      </Link>
      <Button type="button" variant="outlined" onClick={handleLogout}>
        Logout
      </Button>
    </nav>
  );
};

export default Topbar;
