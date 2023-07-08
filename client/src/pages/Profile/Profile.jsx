import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import "./Profile.scss";

const Profile = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="profile-page">
      <h1>Welcome to your profile page!</h1>
      <div className="user-info-card">
        <h3>
          {user.name} {user.surname}
        </h3>
        <h3>Age: {user.age}</h3>
        <h3>Email address: {user.email}</h3>
      </div>
    </div>
  );
};

export default Profile;
