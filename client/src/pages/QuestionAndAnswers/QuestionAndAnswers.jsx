import { useState, useEffect, useContext } from "react";
import { useParams, Link, generatePath } from "react-router-dom";
import { getQuestionWithAnswers } from "../../api/questions";
import { postAnswer } from "../../api/answers";
import { UserContext } from "../../context/UserContext";
import { EDIT_AND_DELETE_QUESTION_ROUTE } from "../../routes/const";
import AnswerCard from "../../components/AnswerCard/AnswerCard";
import NewAnswerCard from "../../components/NewAnswerCard/NewAnswerCard";
import Alert from "../../components/Alert/Alert";

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
      <NewAnswerCard
        answerText={answerText}
        onAnswerTextChange={(e) => setAnswerText(e.target.value)}
        onSubmitAnswer={handleAnswerSubmit}
      />
      {postedAnswer && (
        <Alert title="Your answer has been successfully posted" />
      )}
    </div>
  );
};

export default QuestionAndAnswers;
