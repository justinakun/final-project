import AuthenticatedLayout from "../layouts/AuthenticatedLayout";
import LoginLayout from "../layouts/LoginLayout";
import Main from "../pages/Main/Main";
import NewQuestion from "../pages/NewQuestion/NewQuestion";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Profile from "../pages/Profile/Profile";
import QuestionAndAnswers from "../pages/QuestionAndAnswers/QuestionAndAnswers";
import EditAndDeleteQuestion from "../pages/EditAndDeleteQuestions/EditAndDeleteQuestion";
import EditAndDeleteAnswer from "../pages/EditAndDeleteAnswer/EditAndDeleteAnswer";

export const REGISTER_ROUTE = "/register";
export const LOGIN_ROUTE = "/";
export const MAIN_ROUTE = "/";
export const PROFILE_ROUTE = "/profile";
export const NEW_QUESTION_ROUTE = "/newQuestion";
export const QUESTION_AND_ANSWERS_ROUTE = "/questions/:id/answers";
export const EDIT_AND_DELETE_QUESTION_ROUTE = "/questions/:id";
export const EDIT_AND_DELETE_ANSWER_ROUTE = "/answers/:id";

export const loginRoutes = {
  Layout: LoginLayout,
  routes: [
    {
      path: LOGIN_ROUTE,
      Component: Login,
    },
    {
      path: REGISTER_ROUTE,
      Component: Register,
    },
  ],
};

export const authenticatedRoutes = {
  Layout: AuthenticatedLayout,
  routes: [
    {
      path: MAIN_ROUTE,
      Component: Main,
    },
    {
      path: PROFILE_ROUTE,
      Component: Profile,
    },
    {
      path: NEW_QUESTION_ROUTE,
      Component: NewQuestion,
    },
    {
      path: QUESTION_AND_ANSWERS_ROUTE,
      Component: QuestionAndAnswers,
    },
    {
      path: EDIT_AND_DELETE_QUESTION_ROUTE,
      Component: EditAndDeleteQuestion,
    },
    {
      path: EDIT_AND_DELETE_ANSWER_ROUTE,
      Component: EditAndDeleteAnswer,
    },
  ],
};
