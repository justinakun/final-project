import { BiSolidEditAlt } from "react-icons/bi";
import "./Edited.scss";

const Edited = () => {
  return (
    <div className="edit-text-container">
      <BiSolidEditAlt className="edit-icon" />
      <i>Edited post</i>
    </div>
  );
};

export default Edited;
