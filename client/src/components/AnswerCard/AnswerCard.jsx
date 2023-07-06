import { Link, generatePath } from "react-router-dom";
import { EDIT_AND_DELETE_ANSWER_ROUTE } from "../../routes/const";

const AnswerCard = ({
  name,
  surname,
  answer,
  date,
  edited,
  isUserAnswer,
  answerId,
}) => {
  return (
    <div className="answer-card-container">
      <h3>
        {name} {surname}:
      </h3>
      <p>{answer}</p>
      <p>Date: {date}</p>
      {edited && <p>Edited</p>}
      {isUserAnswer && (
        <Link
          to={generatePath(EDIT_AND_DELETE_ANSWER_ROUTE, {
            id: answerId,
          })}
        >
          UPDATE OR DELETE QUESTION
        </Link>
      )}
    </div>
  );
};

export default AnswerCard;
