const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    position: {
        type: String,
        required: [true, "Position is required"],
    },
    salary: {
        type: Number,
        required: [true, "Salary is required"],
        min: [0, "Salary must be positive"],
    },
});

module.exports = mongoose.model("Employee", EmployeeSchema);