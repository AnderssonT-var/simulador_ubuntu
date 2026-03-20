import { useState } from "react";
import LoginScreen from "./components/LoginScreen/LoginScreen.jsx";
import Desktop from "./components/Desktop/Desktop.jsx";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      {!isLoggedIn && (
        <LoginScreen onLoginComplete={() => setIsLoggedIn(true)} />
      )}
      <Desktop />
    </>
  );
}
