import Topbar from "../components/Topbar/Topbar";

const AuthenticatedLayout = ({ children }) => {
  return (
    <>
      <Topbar />
      <div className="authenticated-container">{children}</div>
    </>
  );
};

export default AuthenticatedLayout;
