import { useState, useEffect, useContext } from "react";
import { useParams, Link, generatePath } from "react-router-dom";
import { getQuestionWithAnswers } from "../../api/questions";
import { UserContext } from "../../context/UserContext";
import { EDIT_AND_DELETE_QUESTION_ROUTE } from "../../routes/const";
import AnswerCard from "../../components/AnswerCard/AnswerCard";
import NewAnswerCard from "../../components/NewAnswerCard/NewAnswerCard";
import Button from "../../components/Button/Button";
const QuestionAndAnswers = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(UserContext);

  useEffect(() => {
    setIsLoading(true);
    getQuestionWithAnswers(id)
      .then((response) => {
        setQuestion(response);
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!question) {
    return <div>Question not found.</div>;
  }

  const isUserCreator = question.userId === user._id;

  return (
    <div>
      {isUserCreator && (
        <Link
          to={generatePath(EDIT_AND_DELETE_QUESTION_ROUTE, {
            id: question._id,
          })}
        >
          UPDATE OR DELETE QUESTION
        </Link>
      )}
      {isUserCreator && <p>You asked the question: </p>}
      {!isUserCreator && (
        <p>
          {question.name} {question.surname} asked the question:
        </p>
      )}
      <h1>{question.question}</h1>
      {question.edited === true ? (
        <p>question has been edited</p>
      ) : (
        <p>Original question</p>
      )}
      {question.answers.map((answer) => (
        <div key={answer._id}>
          <AnswerCard
            name={answer.name}
            surname={answer.surname}
            answer={answer.answer}
            date={answer.date}
            edited={answer.edited} // not showing
          />
        </div>
      ))}
      <NewAnswerCard />
      <Button>Submit your answer</Button>
    </div>
  );
};

export default QuestionAndAnswers;
