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
        console.log(response);
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
    <div>
      <p>
        To edit your question, click on it, change it, and click SAVE.
        Alternatively, you can delete your question.
      </p>
      {isEditing ? (
        <input
          type="text"
          value={question.question}
          onChange={(e) =>
            setQuestion({ ...question, question: e.target.value })
          }
        />
      ) : (
        <h1 onClick={allowEdit}>{question.question}</h1>
      )}
      <Button onClick={handleSaving}>Save</Button>
      <Button onClick={handleDeletion}>Delete</Button>
      {edited && <Alert title="Success! Taking you to question page" />}
      {deleted && (
        <Alert title="Deleted successfully! Taking you to question page" />
      )}
    </div>
  );
};

export default EditAndDeleteQuestion;
