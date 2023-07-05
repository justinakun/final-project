import { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import FormItem from "../../components/FormItem/FormItem";
import Button from "../../components/Button/Button";
import "./Profile.scss";

const Profile = () => {
  const { user, handleUpdateUser } = useContext(UserContext);
  const [name, setName] = useState(user.name);
  const [surname, setSurname] = useState(user.surname);
  const [date, setDate] = useState(user.date);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState(user.password);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = { name, surname, date, email, password };
    handleUpdateUser(user);
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <FormItem
        label="Name"
        containerClassname="form-item"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <FormItem
        label="Surname"
        containerClassname="form-item"
        type="text"
        value={surname}
        onChange={(e) => setSurname(e.target.value)}
        required
      />
      <FormItem
        label="Birth Date"
        containerClassname="form-item"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <FormItem
        label="Email"
        containerClassname="form-item"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <FormItem
        label="Password"
        containerClassname="form-item"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <div className="button-container">
        <Button>Update</Button>
      </div>
    </form>
  );
};

export default Profile;
