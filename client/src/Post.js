import { format } from "date-fns";
import { Link } from "react-router-dom";
import styles from "./Post.module.css"; // Import the CSS module

export default function Post({ _id, title, summary, cover, content, createdAt, author }) {
  console.log("createdAt value: ", createdAt);

  return (
    <div className={styles.entries}>
      <div className={styles.image}>
        <Link to={`/post/${_id}`}>
          <img src={`http://localhost:4000/${cover}`} alt={title} />
        </Link>
      </div>
      <div className={styles.text}>
        <h2 className={styles.entryTitle}>
          <Link className={styles.entryLink} to={`/post/${_id}`}>
            {title}
          </Link>
        </h2>
        <p className={styles.info}>
          <Link className={styles.author} to={`/user/${author._id}`}>
            {author.username}
          </Link>
          <time>{format(new Date(createdAt), "MMM d, yyyy HH:mm")}</time>
        </p>
        <p className={styles.summary}>{summary}</p>
      </div>
    </div>
  );
}
