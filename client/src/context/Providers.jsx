import { UserProvider } from "./UserContext";

// čia dedami ir wrappinami visi provideriai iš context folderio

const Providers = ({ children }) => {
  return <UserProvider>{children}</UserProvider>;
};

export default Providers;
