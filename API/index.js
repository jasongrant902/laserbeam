const validator = require("validator");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/users");
const Post = require("./models/post");
const app = express();
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const fs = require("fs");
const dotenv = require("dotenv");
const verifyToken = require('./middleware/authenticateToken');
const authorizeRoles = require('./middleware/authRoles');
const nodemailer = require("nodemailer");
dotenv.config();

const salt = bcrypt.genSaltSync(10);
const secret = "8502mskp2k4jal2398jfa;kdjv053";

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

mongoose.connect(process.env.MONGODB_URI);

app.post("/register", async (req, res) => {
  const username = req.body.username.toLowerCase();
  const { password, firstName, lastName, passwordHint, email, nationality } =
    req.body;

  if (!validator.isEmail(email)) {
    return res.status(400).json("Invalid email address format.");
  }

  try {
    const UserDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
      firstName,
      lastName,
      email,
      passwordHint,
      nationality,
    });
    res.json(UserDoc);
  } catch (e) {
    if (e.code === 11000 && e.keyPattern?.email) {
      return res
        .status(400)
        .json("Email address already associated with an existing account.");
    }

    if (e.code === 11000 && e.keyPattern?.username) {
      return res.status(400).json("Username already taken.");
    }

    console.error("Registration error:", e);
    res.status(500).json("Registration failed due to a server error.");
  }
});

app.post("/login", async (req, res) => {
  const username = req.body.username.toLowerCase();
  const { password } = req.body;

  try {
    const UserDoc = await User.findOne({ username });

    if (!UserDoc) {
      return res.status(404).json({ error: "User not found" });
    }

    const passCheck = bcrypt.compareSync(password, UserDoc.password);

    if (!passCheck) {
      return res.status(401).json({
        error: "Incorrect password",
        passwordHint: UserDoc.passwordHint || null,
      });
    }

    jwt.sign({ username, id: UserDoc._id, role: UserDoc.role }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id: UserDoc._id,
        username,
        role: UserDoc.role
      });
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");
    const expiration = Date.now() + 3600000;

    user.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
    user.resetPasswordExpires = new Date(expiration);
    await user.save();

    const resetLink = `http://localhost:3000/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    const transporter = nodemailer.createTransport({
      host: "smtp.resend.com",
      port: 587,
      secure: false,
      auth: {
        user: "resend",
        pass: process.env.RESEND_API_KEY,
      }
    });

    const mailOptions = {
      to: email,
      from: "no-reply@laserbeam.gg",
      subject: "Laserbeam Password Reset",
      html: `<p>Click the link to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
};

  await transporter.sendMail(mailOptions);

     res.json({ message: "Reset link sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: "no token provided" });
  }

  jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.json(info);
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

app.post("/create", uploadMiddleware.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const extension = parts[parts.length - 1];
  const newPath = path + "." + extension;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;

    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });

    res.json({ postDoc });
  });
});

app.put("/update", uploadMiddleware.single("file"), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const extension = parts[parts.length - 1];
    newPath = path + "." + extension;
    fs.renameSync(path, newPath);
  }
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json("Not logged in");
  }
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!postDoc) {
      return res.status(404).json("Post not found");
    }
    if (!postDoc.author.equals(info.id)) {
      return res.status(400).json("Only the author of the post can make edits");
    }
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        title,
        content,
        summary,
        cover: newPath ? newPath : postDoc.cover,
      },
      { new: true }
    );
    res.json(postDoc);
  });
});

app.get("/post", async (req, res) => {
  res.json(
    await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20)
  );
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(postDoc);
});

app.get("/profile/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id, { password: 0 });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
