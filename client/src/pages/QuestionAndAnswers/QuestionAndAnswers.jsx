import { useState, useEffect, useContext } from "react";
import { useParams, Link, generatePath } from "react-router-dom";
import { getQuestionWithAnswers } from "../../api/questions";
import { postAnswer } from "../../api/answers";
import { UserContext } from "../../context/UserContext";
import { EDIT_AND_DELETE_QUESTION_ROUTE } from "../../routes/const";
import AnswerCard from "../../components/AnswerCard/AnswerCard";
import NewAnswerCard from "../../components/NewAnswerCard/NewAnswerCard";
import Alert from "../../components/Alert/Alert";
import Likes from "../../components/LikeDislike/LikeDislike";
import "./QuestionAndANswers.scss";
import { getFormattedDate, getFormattedTime } from "../../utils/date";
import Edited from "../../components/Edited/Edited";
const QuestionAndAnswers = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(UserContext);
  const [answerText, setAnswerText] = useState("");
  const [postedAnswer, setPostedAnswer] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getQuestionWithAnswers(id)
      .then((response) => {
        setQuestion(response);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (postedAnswer) {
      const timer = setTimeout(() => {
        setPostedAnswer(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [postedAnswer]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!question) {
    return <div>Question not found.</div>;
  }

  const isUserCreator = question.userId === user._id;

  const handleAnswerSubmit = () => {
    const answer = {
      newAnswer: answerText,
      name: user.name,
      surname: user.surname,
      idUser: user._id,
      id: question._id,
    };

    postAnswer(answer)
      .then((response) => {
        console.log("Answer submitted successfully");
        setAnswerText("");
        setPostedAnswer(true);
        getQuestionWithAnswers(id)
          .then((response) => {
            setQuestion(response);
            console.log(response);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error("Failed to submit answer:", error);
      });
  };

  return (
    <div className="page-container">
      <div className="single-question-container">
        <div className="single-question-top">
          {isUserCreator && (
            <div>
              Posted by you on {getFormattedDate(question.date)} at{" "}
              {getFormattedTime(question.date)}
            </div>
          )}
          {!isUserCreator && (
            <div>
              Posted by {question.name} {question.surname} on{" "}
              {getFormattedDate(question.date)} at{" "}
              {getFormattedTime(question.date)}
            </div>
          )}
          {isUserCreator && (
            <div>
              <Link
                className="edit-link"
                to={generatePath(EDIT_AND_DELETE_QUESTION_ROUTE, {
                  id: question._id,
                })}
              >
                Edit
              </Link>
            </div>
          )}
        </div>
        <div className="single-question-contents">
          <h1>{question.question}</h1>
        </div>
        <div className="single-question-bottom">
          {question.edited === true ? (
            <Edited />
          ) : (
            <div className="original-text-container">
              <i>Original post</i>
            </div>
          )}
        </div>{" "}
      </div>

      {question.answers.map((answer) => (
        <div key={answer._id} className="single-answer-container">
          <Likes
            answerId={answer._id}
            likedBy={answer.likedBy}
            dislikedBy={answer.dislikedBy}
            userId={user._id}
          />
          <AnswerCard
            answerId={answer._id}
            name={answer.name}
            surname={answer.surname}
            answer={answer.answer}
            date={answer.date}
            edited={answer.edited}
            isUserAnswer={answer.userId === user._id}
          />
        </div>
      ))}
      <div className="new-answer-container">
        <NewAnswerCard
          answerText={answerText}
          onAnswerTextChange={(e) => setAnswerText(e.target.value)}
          onSubmitAnswer={handleAnswerSubmit}
        />
      </div>

      {postedAnswer && (
        <Alert title="Your answer has been successfully posted" />
      )}
    </div>
  );
};

export default QuestionAndAnswers;
