const express = require("express");
const mongoose = require("mongoose");
const app = express();

mongoose.set("strictQuery", false);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const mongoURI = process.env.MONGODB_URI || "mongodb://mongo:27017/users";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
      console.error("MongoDB connection error:", err);
      process.exit(1);
  });

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    console.log("Login attempt:", { username, password });

    try {
        const user = await User.findOne({ username, password });
        if (user) {
            res.json({ success: true, redirect: "/congratulations.html" });
        } else {
            res.json({ success: false, redirect: "/sorry.html" });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.json({ success: false, redirect: "/sorry.html" });
    }
});

app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
