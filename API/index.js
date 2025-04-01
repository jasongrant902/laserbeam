const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/users');
const Post = require('./models/post');
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' })
const fs = require('fs');

const salt = bcrypt.genSaltSync(10);
const secret = '8502mskp2k4jal2398jfa;kdjv053';

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

mongoose.connect('mongodb+srv://laserbeam:Fitzjames7904@cluster0.6hm3f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

app.post('/register', async (req,res) => {
    const {username, password, firstName, lastName, passwordHint, email, nationality} = req.body; 
    try {
        const UserDoc = await User.create({
            username,
            password:bcrypt.hashSync(password,salt),
            firstName,
            lastName,
            email,
            passwordHint,
            nationality,
        });
        res.json(UserDoc);
    } catch (e) {
        res.status(400).json(e);
    }
});

app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const UserDoc = await User.findOne({username});
    const passCheck = bcrypt.compareSync(password, UserDoc.password);
    if(passCheck) {
        jwt.sign({username, id:UserDoc._id}, secret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).json({
                id:UserDoc._id,
                username,
            });

        });
    }
    else {
        res.status(400).json('Credentials are incorrect');
    }
});

app.get('/profile', (req,res) => {
    const {token} = req.cookies;
    if (!token) {
        return res.status(401).json({message: "no token provided"})
    }

    jwt.verify(token, secret, {}, (err,info) => {
        if (err) {
            return res.status(401).json({message: "Invalid token"});
        }
        res.json(info);
    })
})

app.post('/logout', (req,res) => {
    res.cookie('token', '').json('ok');
})

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const extension = parts[parts.length - 1];
    const newPath = path + '.' + extension;
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

app.put('/post', uploadMiddleware.single('file'), async (req,res) => {
    let newPath = null;
    if(req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const extension = parts[parts.length - 1];
        newPath = path + '.' + extension;
        fs.renameSync(path, newPath);
    }
    const {token} = req.cookies;
    if (!token){
        return res.status(401).json("Not logged in")
    }
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const {id, title, summary, content } = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if(!postDoc){
            return res.status(404).json('Post not found');
        }
        if(!postDoc.author.equals(info.id)) {
            return res.status(400).json('Only the author of the post can make edits')
        }
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {
            title, 
            content, 
            summary,
            cover: newPath ? newPath : postDoc.cover,
        },
        {new : true}
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

app.get('/post/:id', async(req, res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
})

app.listen('4000')
//mongodb+srv://laserbeam:Fitzjames7904@cluster0.6hm3f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0