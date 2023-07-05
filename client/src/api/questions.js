import axios from "axios";

export const getSortedQuestions = async (sort) => {
  const response = await axios.get(
    `http://localhost:3000/questions?sort=${sort}`
  );
  return response.data;
};

export const createQuestion = async (question) => {
  const response = await axios.post(
    "http://localhost:3000/questions",
    question
  );
  return response.data;
};
