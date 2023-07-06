const AnswerCard = ({ name, surname, answer, date, edited }) => {
  return (
    <div className="answer-card-container">
      <h3>
        {name} {surname}:
      </h3>
      <p>{answer}</p>
      <p>Date: {date}</p>
      {edited && <p>Edited</p>}
    </div>
  );
};

export default AnswerCard;
