import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormItem from "../../components/FormItem/FormItem";
import Button from "../../components/Button/Button";
import { createQuestion } from "../../api/questions";
import { UserContext } from "../../context/UserContext";
import { MAIN_ROUTE } from "../../routes/const";
import Alert from "../../components/Alert/Alert";

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
    <div>
      <form className="form" onSubmit={handleNewQuestion}>
        <FormItem
          label="Type in your question"
          containerClassname="form-item"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <div>
          <Button type="submit">Submit</Button>
        </div>
      </form>
      {success && <Alert title="Success! Taking you to the main page...." />}
    </div>
  );
};

export default NewQuestion;
