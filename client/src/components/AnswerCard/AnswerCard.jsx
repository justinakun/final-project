import { Link, generatePath } from "react-router-dom";
import { EDIT_AND_DELETE_ANSWER_ROUTE } from "../../routes/const";
import { getFormattedDate } from "../../utils/date";
import { getFormattedTime } from "../../utils/date";
import PropTypes from "prop-types";
import Edited from "../Edited/Edited";
import "./AnswerCard.scss";

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

AnswerCard.propTypes = {
  name: PropTypes.string.isRequired,
  surname: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  edited: PropTypes.bool.isRequired,
  isUserAnswer: PropTypes.bool.isRequired,
  answerId: PropTypes.string.isRequired,
};

export default AnswerCard;
