import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAnAnswer, updateAnswer, deleteAnswer } from "../../api/answers";
import Button from "../../components/Button/Button";
import Alert from "../../components/Alert/Alert";
import { QUESTION_AND_ANSWERS_ROUTE } from "../../routes/const";

const EditAndDeleteAnswer = () => {
  const { id } = useParams();
  const [answer, setAnswer] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getAnAnswer(id)
      .then((response) => {
        setAnswer(response);
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
      const questionId = answer.questionId; // Fetch the questionId from the answer object
      const redirectTimer = setTimeout(() => {
        navigate(QUESTION_AND_ANSWERS_ROUTE.replace(":id", questionId));
      }, 2000);

      return () => clearTimeout(redirectTimer);
    }
  }, [edited, deleted, navigate, answer]);

  const handleSaving = () => {
    console.log(answer);
    updateAnswer(answer)
      .then((response) => {
        console.log(response);
        setEdited(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDeletion = () => {
    deleteAnswer(answer._id)
      .then((response) => {
        console.log(response);
        setDeleted(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (!answer) {
    return <div>Loading....</div>;
  }

  return (
    <div>
      <p>
        To edit your answer, click on it, change it, and click SAVE.
        Alternatively, you can delete your answer.
      </p>
      {isEditing ? (
        <input
          type="text"
          value={answer.answer}
          onChange={(e) => setAnswer({ ...answer, answer: e.target.value })}
        />
      ) : (
        <h1 onClick={allowEdit}>{answer.answer}</h1>
      )}
      <Button onClick={handleSaving}>Save</Button>
      <Button onClick={handleDeletion}>Delete</Button>
      {edited && <Alert title="Success! Taking you to the question page" />}
      {deleted && (
        <Alert title="Deleted successfully! Taking you to the question page" />
      )}
    </div>
  );
};

export default EditAndDeleteAnswer;
