import FormItem from "../../components/FormItem/FormItem";
import { useState, useContext } from "react";
import Button from "../../components/Button/Button";
import { createQuestion } from "../../api/questions";
import { UserContext } from "../../context/UserContext";

const NewQuestion = () => {
  const [question, setQuestion] = useState("");
  const { user } = useContext(UserContext);

  const handleNewQuestion = (e) => {
    e.preventDefault();
    createQuestion({ question, userId: user.id })
      .then((response) => {
        console.log(response);
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
    </div>
  );
};

export default NewQuestion;
