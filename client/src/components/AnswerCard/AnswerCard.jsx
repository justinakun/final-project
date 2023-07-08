import { Link, generatePath } from "react-router-dom";
import { EDIT_AND_DELETE_ANSWER_ROUTE } from "../../routes/const";
import "./AnswerCard.scss";
import { getFormattedDate } from "../../utils/date";
import { getFormattedTime } from "../../utils/date";
import Edited from "../Edited/Edited";
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
      <div className="answer-card-top">
        {isUserAnswer && <div>You:</div>}
        {!isUserAnswer && (
          <div>
            {name} {surname}:
          </div>
        )}

        {isUserAnswer && (
          <div>
            {" "}
            <Link
              className="edit-link"
              to={generatePath(EDIT_AND_DELETE_ANSWER_ROUTE, {
                id: answerId,
              })}
            >
              Edit
            </Link>
          </div>
        )}
      </div>
      <div className="answer-card-main">
        {" "}
        <h3 className="the-answer">{answer}</h3>
      </div>
      <div className="answer-card-bottom">
        <div>
          On {getFormattedDate(date)} at {getFormattedTime(date)}
        </div>
        <div>
          {edited && <Edited />}
          {!edited && (
            <div className="original-post-text">
              <i>Original Post</i>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnswerCard;
