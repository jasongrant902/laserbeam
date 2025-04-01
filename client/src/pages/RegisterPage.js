import { useState } from "react";
import ReactFlagsSelect from "react-flags-select";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [passwordHint, setPasswordHint] = useState("");
  const [nationality, setNationality] = useState(null);

  async function register(ev) {
    ev.preventDefault();
    const response = await fetch("http://localhost:4000/register", {
      method: "POST",
      body: JSON.stringify({ username, password, firstName, lastName, email, nationality, passwordHint }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.status !== 200) {
      alert("Registration failed");
    } else {
      alert("Registration successful");
    }
  }

  return (
    <form className="register" onSubmit={register}>
      <h1>Sign Up For Laserbeam</h1>
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
        ></input>
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
              stroke-width="1.5"
              stroke="currentColor"
              className="eye-icon"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 
          7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="eye-icon"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 
  2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 
  10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 
  0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
          )}
        </button>
      </div>
      <input
        type="passwordhint"
        placeholder="Password hint (Optional)"
        value={passwordHint}
        onChange={(e) => setPasswordHint(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="firstname"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        type="lastname"
        placeholder="Last Name (Optional)"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <div className="flags-wrapper">
      <ReactFlagsSelect
        selected={nationality}
        onSelect={(code) => setNationality(code)}
        searchable
        placeholder="Select Nationality (Optional)"
      />
      </div>
      <br></br>
      <button>Register</button>
    </form>
  );
}
