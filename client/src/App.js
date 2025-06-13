import "./App.css";
import Post from "./Post.js";
import Header from "./components/Header/Header"
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout.js";
import HomePage from "./pages/HomePage.js";
import LoginPage from "./pages/LoginPage.js";
import RegisterPage from "./pages/RegisterPage.js";
import { UserContextProvider } from "./userContext.js";
import CreatePost from "./pages/CreatePost.js";
import PostPage from "./pages/PostPage.js";
import EditPost from "./pages/EditPost.js";
import ProfilePage from "./pages/ProfilePage.js";

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/edit/:id" element={<EditPost />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
