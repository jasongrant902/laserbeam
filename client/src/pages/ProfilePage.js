import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../userContext";

export default function ProfilePage(){
    const { id } = useParams();
    const { userInfo } = useContext(UserContext);
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:4000/profile/${id}`, {
          credentials: "include",
        })
          .then((res) => res.json())
          .then((data) => setProfileData(data));
      }, [id]);

      if(!profileData) return <div>Loading...</div>

      return (
        <div>
          <h1>{profileData.username}'s Profile</h1>
          <p>User ID: {profileData._id}</p>
        </div>
      );
    }