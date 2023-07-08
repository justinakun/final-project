import Button from "../Button/Button";
import "./NewAnswerCard.scss";

const NewAnswerCard = ({ answerText, onAnswerTextChange, onSubmitAnswer }) => {
  return (
    <div className="new-answer-card-container">
      <textarea
        className="text-area"
        value={answerText}
        onChange={onAnswerTextChange}
        placeholder="Type your answer here..."
      ></textarea>
      <Button onClick={onSubmitAnswer}>Post</Button>
    </div>
  );
};

export default NewAnswerCard;
