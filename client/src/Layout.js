import { useState, useContext } from "react";
import { UserContext } from "./userContext";
import Header from "./components/Header/Header";
import { Outlet, useNavigate } from "react-router-dom";
import styles from "./Layout.module.css";

export default function Layout() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { setUserInfo } = useContext(UserContext);
  const navigate = useNavigate();

  function handleLogoutConfirm() {
    fetch("http://localhost:4000/logout", {
      method: "POST",
      credentials: "include",
    }).then(() => {
      setUserInfo(null);
      setShowLogoutConfirm(false);
      navigate("/");
    });
  }
  return (
    <>
      {showLogoutConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <p>Are you sure you want to logout?</p>
            <div className={styles.modalButtons}>
              <button onClick={handleLogoutConfirm}>Yes</button>
              <button onClick={() => setShowLogoutConfirm(false)}>No</button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`${styles.pageWrapper} ${
          showLogoutConfirm ? styles.blurred : ""
        }`}
      >
        <div className={styles.contentContainer}>
          <Header onLogoutClick={() => setShowLogoutConfirm(true)} />
          <Outlet />
        </div>
      </div>
    </>
  );
}
