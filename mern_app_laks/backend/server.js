const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
const PORT = 9000;

// Mock user (replace with database in production)
const mockUser = {
  username: "admin",
  password: bcrypt.hashSync("admin", 8), // Hashed password
};

// Middleware
app.use(express.json()); // Parse JSON bodies

const corsOptions = {
  origin: ["http://localhost:3000", "http://13.201.41.69:3000"], // React app origin
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: ["Content-Type", "x-access-token"],
};

app.use(cors(corsOptions)); // Enable Cross-Origin Resource Sharing

// Secret key for JWT
const SECRET_KEY = "mysecretkey";

app.post("/heatlz", (req, res) => {
    console.log('Backend App is running')
});
// Login endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  console.log("Request Body:", req.body);
  console.log("Username:", username, "Password:", password);

  if (!username || !password) {
    return res.status(400).send({ message: "Username and password are required." });
  }

  if (username !== mockUser.username) {
    return res.status(404).send({ message: "User not found" });
  }

  const passwordIsValid = bcrypt.compareSync(password, mockUser.password);
  if (!passwordIsValid) {
    return res.status(401).send({ message: "Invalid password" });
  }

  const token = jwt.sign({ id: mockUser.username }, SECRET_KEY, { expiresIn: 86400 }); // 1 day
  res.send({ token, message: "Login successful" });
});

// Protected endpoint
app.get("/dashboard", (req, res) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(500).send({ message: "Failed to authenticate token" });
    }
    res.send({ message: `Welcome ${decoded.id}`, user: decoded.id });
  });
});

// Catch-all route for unsupported endpoints
app.use((req, res) => {
  res.status(404).send({ message: "Endpoint not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
