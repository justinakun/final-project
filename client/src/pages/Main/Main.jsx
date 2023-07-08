import { useState, useEffect } from "react";
import { getSortedQuestions } from "../../api/questions";
import Button from "../../components/Button/Button";
import { getFormattedDate, getFormattedTime } from "../../utils/date";
import { Link, generatePath } from "react-router-dom";
import { NEW_QUESTION_ROUTE } from "../../routes/const";
import { QUESTION_AND_ANSWERS_ROUTE } from "../../routes/const";
import "./Main.scss";

const Main = () => {
  const [allQuestions, setAllQuestions] = useState([]);
  const [sort, setSort] = useState("dsc");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getSortedQuestions(sort)
      .then((response) => {
        setAllQuestions(response);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [sort]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (allQuestions.length === 0) {
    return <div>There are no questions yet.</div>;
  }

  return (
    <div className="main-container">
      <div className="main-links-buttons">
        <div>
          <Link to={NEW_QUESTION_ROUTE} className="new-question-link">
            Ask a Question
          </Link>
        </div>
        <div className="filtering-buttons">
          <Button onClick={() => setSort("dsc")}>Newest</Button>
          <Button onClick={() => setSort("asc")}>Oldest</Button>
          <Button>Answered</Button>
          <Button>Unanswered</Button>
        </div>
      </div>

      {allQuestions.map((question) => (
        <Link
          key={question._id}
          to={generatePath(QUESTION_AND_ANSWERS_ROUTE, { id: question._id })}
        >
          <div key={question._id} className="link-to-questions">
            <h1 className="link-to-questions-title">{question.question}</h1>
            <div>
              {
                <p>
                  Question created on {getFormattedDate(question.date)} at{" "}
                  {getFormattedTime(question.date)}
                </p>
              }
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Main;
