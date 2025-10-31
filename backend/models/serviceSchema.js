import mongoose from "mongoose"; // Import mongoose

const serviceSchema = new mongoose.Schema( // Define schema for Service
    {
        title: { // Service title
            type: String,
            required: true,
            trim: true,
        },
        description: { // Service description
            type: String,
            required: true,
            trim: true,
        },
        price: { // Service price
            type: Number,
            required: true,
            min: 0,
        },
        category: { // Service category
            type: String,
            required: true,
            trim: true,
        },
        provider: { // Reference to User model
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["draft", "active", "paused", "archived"], // add "active" if you need it
            default: "draft"
        },
        approved: { // Approval status
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true } // Add createdAt and updatedAt fields
);
const Service = mongoose.model("Service", serviceSchema);

export default Service;