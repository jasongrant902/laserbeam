import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { UserContext } from "../userContext";
import styles from "./PostPage.module.css";

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:4000/post/${id}`).then((response) => {
      response.json().then((postInfo) => {
        setPostInfo(postInfo);
      });
    });
  }, [id]);

  if (!postInfo) return "";

  return (
    <div className={styles.postPage}>
      <h1 className={styles.title}>{postInfo.title}</h1>
      <time className={styles.time}>
        {format(new Date(postInfo.createdAt), "MMM d, yyyy")}
      </time>
      <div className={styles.author}>by {postInfo.author.username}</div>

      {userInfo && userInfo.id === postInfo.author._id && (
        <div className={styles.editRow}>
          <Link className={styles.editBtn} to={`/edit/${postInfo._id}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className={styles.editIcon}
            >
              <path d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.419a4 4 0 0 0-.885 1.343Z" />
            </svg>
            Edit this post
          </Link>
        </div>
      )}

      <div className={styles.image}>
        <img src={`http://localhost:4000/${postInfo.cover}`} alt="" />
      </div>

      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      />
    </div>
  );
}
