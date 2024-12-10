const ProductSchema = {
    item: {
        type: String,
        required: [true, "Name of item is required"],
    },
    price_in_usd: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Please enter a positive value"]
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        enum: [
            "Educational Supplies",
            "Office Furniture",
            "Electronics",
            "Travel Supplies and Luggage",
            "Snacks, Games, Gifts"
        ]
    },
    stock_quantity: {
        type: Number,
        required: true,
        min: [0, "Stock quantity cannot be negative"],
        default: 0
    },
    description: {
        type: String,
        maxlength: [500, "Description cannot exceed 500 characters"]
    },
    discount: {
        type: Number,
        min: [0, "Discount cannot be negative"],
        max: [100, "Discount cannot exceed 100%"],
        default: 0
    },
    unit: {
        type: String,
        required: [true, "Unit is required"],
        enum: ["pieces", "kg", "liters", "g", "ml", "other"]
    }
};
