import Button from "../Button/Button";

const NewAnswerCard = ({ answerText, onAnswerTextChange, onSubmitAnswer }) => {
  return (
    <div>
      <h3>Add Your Answer</h3>
      <textarea
        value={answerText}
        onChange={onAnswerTextChange}
        placeholder="Enter your answer..."
      ></textarea>
      <Button onClick={onSubmitAnswer}>Submit</Button>
    </div>
  );
};

export default NewAnswerCard;
