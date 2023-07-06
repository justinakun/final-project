import axios from "axios";

export const getAQuestion = async (id) => {
  const response = await axios.get(`http://localhost:3000/questions/${id}`);
  return response.data;
};

export const getSortedQuestions = async (sort) => {
  const response = await axios.get(
    `http://localhost:3000/questions?sort=${sort}`
  );
  return response.data;
};

export const createQuestion = async (info) => {
  const response = await axios.post("http://localhost:3000/questions", info);
  return response.data;
};

export const getQuestionWithAnswers = async (id) => {
  const response = await axios.get(
    `http://localhost:3000/questions/${id}/answers`
  );
  return response.data;
};

export const updateQuestion = async (question) => {
  const response = await axios.patch(
    `http://localhost:3000/questions/${question._id}/`,
    question
  );
  return response.data;
};

export const deleteQuestion = async (id) => {
  console.log(id);
  const response = await axios.delete(`http://localhost:3000/questions/${id}`);
  return response.data;
};
