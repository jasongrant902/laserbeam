import { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../userContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [passwordHint, setPasswordHint] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // <--- added here
  const { setUserInfo } = useContext(UserContext);

  async function login(ev) {
    ev.preventDefault();
    setErrorMsg("");
    setPasswordHint("");

    const response = await fetch("http://localhost:4000/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (response.ok) {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
        setRedirect(true);
      });
    } else {
      const result = await response.json();
      if (result.passwordHint) {
        setErrorMsg("Incorrect Password")
        setPasswordHint(result.passwordHint);
      } else {
        setErrorMsg(result.error || "Login failed");
      }
      console.log("Login error response:", result);
    }
  }

  if (redirect) {
    return <Navigate to={"/"}></Navigate>;
  }

  return (
    <form className="login" onSubmit={login}>
      <h1>Login</h1>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
      />

      <div className="password-container">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
        />
        <button
          type="button"
          className="show-btn"
          onMouseDown={() => setShowPassword(true)}
          onMouseUp={() => setShowPassword(false)}
          onMouseLeave={() => setShowPassword(false)}
        >
          {showPassword ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="eye-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 
              7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="eye-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 
              2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 
              10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 
              0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
          )}
        </button>
      </div>

      <br />

      <button type="submit">Login</button>

      {errorMsg && <p className="error-msg">{errorMsg}</p>}

       {passwordHint && (
          <div
            className="hint-bubble"
            onMouseDown={() => setShowHint(true)}
            onMouseUp={() => setShowHint(false)}
            onMouseLeave={() => setShowHint(false)}
          >
            {showHint ? passwordHint : "💡 Need a hint?"}
          </div>
        )}
    </form>
  );
}
