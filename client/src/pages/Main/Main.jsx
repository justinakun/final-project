import { useState, useEffect } from "react";
import { getSortedQuestions } from "../../api/questions";
import Button from "../../components/Button/Button";
import { getFormattedDate } from "../../utils/date";
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

  // Render a message if there are no questions
  if (allQuestions.length === 0) {
    return <div>There are no questions yet.</div>;
  }

  return (
    <div className="main-container">
      <Link to={NEW_QUESTION_ROUTE}>Ask Question</Link>
      <Button onClick={() => setSort("dsc")}>Newest</Button>
      <Button onClick={() => setSort("asc")}>Oldest</Button>

      {allQuestions.map((question) => (
        <Link
          key={question._id}
          to={generatePath(QUESTION_AND_ANSWERS_ROUTE, { id: question._id })}
        >
          <div key={question._id}>
            <h1>{question.question}</h1>
            <div>
              {question.edited && (
                <p>Question edited on {getFormattedDate(question.date)}</p>
              )}
              {!question.edited && (
                <p>Question created on {getFormattedDate(question.date)}</p>
              )}{" "}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Main;
