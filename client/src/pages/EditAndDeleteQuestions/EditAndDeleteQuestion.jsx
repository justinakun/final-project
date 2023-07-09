import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  getAQuestion,
  updateQuestion,
  deleteQuestion,
} from "../../api/questions";
import Button from "../../components/Button/Button";
import Alert from "../../components/Alert/Alert";
import { MAIN_ROUTE } from "../../routes/const";
import "./EditANdDeleteQuestion.scss";

const EditAndDeleteQuestion = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getAQuestion(id)
      .then((response) => {
        setQuestion(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  const allowEdit = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    if (edited || deleted) {
      const redirectTimer = setTimeout(() => {
        navigate(MAIN_ROUTE);
      }, 2000);

      return () => clearTimeout(redirectTimer);
    }
  }, [edited, deleted, navigate]);

  const handleSaving = () => {
    console.log(question);
    updateQuestion(question)
      .then((response) => {
        console.log(response);
        setEdited(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDeletion = () => {
    deleteQuestion(question._id)
      .then((response) => {
        console.log(response);
        setDeleted(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (!question) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit-question-page">
      {deleted && (
        <Alert
          className="success"
          title="Deleted successfully! Taking you to main page..."
        />
      )}
      {edited && (
        <Alert className="success" title="Success! Taking you to  page..." />
      )}
      <div className="edit-question-container">
        <h2>You are welcome to edit or delete your question here</h2>
        {isEditing ? (
          <textarea
            className="text-area"
            type="text"
            value={question.question}
            onChange={(e) =>
              setQuestion({ ...question, question: e.target.value })
            }
          />
        ) : (
          <textarea
            className="text-area"
            onClick={allowEdit}
            defaultValue={question.question}
          />
        )}
        <div className="btns-container">
          <Button onClick={handleSaving}>Post My Edited Question</Button>
          <Button onClick={handleDeletion}>Delete My Question</Button>
        </div>
      </div>
    </div>
  );
};

export default EditAndDeleteQuestion;
