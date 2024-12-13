const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/mecazon-database", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Database connection error:", error));

// Models
const GroceryItems = require("./models/GroceryItems");
const Employees = require("./models/Employees");
const Users = require("./models/UserSchema");

// Routes

/** ========================
 *  Groceries CRUD Routes
 *  ======================== */

// Get all groceries
app.get("/api/groceries", async (req, res) => {
  try {
    const groceries = await GroceryItems.find();
    res.json(groceries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single grocery item by ID
app.get("/api/groceries/:id", async (req, res) => {
  try {
    const grocery = await GroceryItems.findById(req.params.id);
    if (!grocery) return res.status(404).json({ message: "Grocery item not found" });
    res.json(grocery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new grocery item
app.post("/api/groceries", async (req, res) => {
  try {
    const newGrocery = new GroceryItems(req.body);
    await newGrocery.save();
    res.status(201).json(newGrocery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a grocery item
app.put("/api/groceries/:id", async (req, res) => {
  try {
    const updatedGrocery = await GroceryItems.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedGrocery) return res.status(404).json({ message: "Grocery item not found" });
    res.json(updatedGrocery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a grocery item
app.delete("/api/groceries/:id", async (req, res) => {
  try {
    const deletedGrocery = await GroceryItems.findByIdAndDelete(req.params.id);
    if (!deletedGrocery) return res.status(404).json({ message: "Grocery item not found" });
    res.json({ message: "Grocery item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/** ==========================
 *  Employees CRUD Routes
 *  ========================== */

// Get all employees
app.get("/api/employees", async (req, res) => {
  try {
    const employees = await Employees.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single employee by ID
app.get("/api/employees/:id", async (req, res) => {
  try {
    const employee = await Employees.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new employee
app.post("/api/employees", async (req, res) => {
  try {
    const newEmployee = new Employees(req.body);
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an employee
app.put("/api/employees/:id", async (req, res) => {
  try {
    const updatedEmployee = await Employees.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEmployee) return res.status(404).json({ message: "Employee not found" });
    res.json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an employee
app.delete("/api/employees/:id", async (req, res) => {
  try {
    const deletedEmployee = await Employees.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) return res.status(404).json({ message: "Employee not found" });
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/** ========================
 *  User Authentication
 *  ======================== */

// User registration
app.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new Users({ ...req.body, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// User login
app.post("/login", async (req, res) => {
  try {
    const user = await Users.findOne({ username: req.body.username });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, "your_secret_key", { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware for error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "An unexpected error occurred!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
