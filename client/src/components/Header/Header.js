import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../userContext";
import styles from "./Header.module.css";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);

  useEffect(() => {
    fetch("http://localhost:4000/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  function logout() {
    fetch("http://localhost:4000/logout", {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
  }

  const username = userInfo?.username;

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        Laserbeam
      </Link>
      <nav className={styles.nav}>
        {username ? (
          <>
            <Link to="/create">Create New Post</Link>
            <Link to={`/profile/${userInfo.id}`}>Profile</Link>
            <a onClick={logout}>Logout</a>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
