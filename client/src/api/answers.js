import axios from "axios";

export const postAnswer = async (answer) => {
  console.log(answer);
  const response = await axios.post(
    `http://localhost:3000/questions/${answer.id}/answers`,
    answer
  );
  return response.data;
};

export const getAnAnswer = async (id) => {
  const response = await axios.get(`http://localhost:3000/answers/${id}`);
  return response.data;
};

export const updateAnswer = async (answer) => {
  console.log(answer._id);
  const response = await axios.patch(
    `http://localhost:3000/answers/${answer._id}`,
    answer
  );
  return response.data;
};

export const deleteAnswer = async (id) => {
  console.log(id);
  const response = await axios.delete(`http://localhost:3000/answers/${id}`);
  return response.data;
};

export const updateAnswerLikes = async (
  answerId,
  updatedLikedBy,
  updatedDislikedBy
) => {
  const data = {
    likedBy: updatedLikedBy,
    dislikedBy: updatedDislikedBy,
  };
  console.log(data);

  const response = await axios.patch(
    `http://localhost:3000/answers/${answerId}/likes`,
    data
  );
  return response.data;
};
