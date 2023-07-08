import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import { createQuestion } from "../../api/questions";
import { UserContext } from "../../context/UserContext";
import { MAIN_ROUTE } from "../../routes/const";
import Alert from "../../components/Alert/Alert";
import "./NewQuestion.scss";

const NewQuestion = () => {
  const [question, setQuestion] = useState("");
  const [success, setSuccess] = useState(false);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (success) {
      const redirectTimer = setTimeout(() => {
        navigate(MAIN_ROUTE);
      }, 2000);

      return () => clearTimeout(redirectTimer);
    }
  }, [success, navigate]);

  const handleNewQuestion = (e) => {
    e.preventDefault();
    createQuestion({
      question,
      userId: user._id,
      name: user.name,
      surname: user.surname,
    })
      .then((response) => {
        setSuccess(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="new-question-page">
      {success && (
        <Alert
          title="Success! Taking you to the main page..."
          className="success"
        />
      )}
      <div className="new-question-container">
        <div>
          <h2>Ask away...</h2>
        </div>
        <form onSubmit={handleNewQuestion}>
          <textarea
            type="text"
            className="text-area"
            rows="7"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <div className="btn-container">
            <Button type="submit">Post My Question</Button>
          </div>
        </form>
        <div></div>
      </div>
    </div>
  );
};

export default NewQuestion;
