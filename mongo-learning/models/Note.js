import mongoose from "mongoose";

// --- LESSON 1: THE SCHEMA (The Blueprint) ---
// MongoDB is "schemaless" (you can save anything), but Mongoose 
// enforces a structure so our app doesn't break.
// 
// Here we define what a "Note" looks like.
const NoteSchema = new mongoose.Schema({

    // Simple String field
    title: {
        type: String,
        required: true, // Validation: Must have a title
        trim: true      // Formatting: Removes namespace "  Hello  " -> "Hello"
    },

    // String field with default value
    content: {
        type: String,
        default: "Empty note"
    },

    // Number field
    priority: {
        type: Number,
        min: 1,
        max: 5,
        default: 1
    },

    // Array of Strings (Tags)
    tags: [String],

    // Date field (Automatically set)
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// --- LESSON 2: THE MODEL (The Tool) ---
// The Schema is just a definition. The MODEL is what we use to 
// Find, Create, Update, and Delete documents.
//
// "Note" -> Mongoose will determine collection name is "notes" (lowercase, plural)
const Note = mongoose.model("Note", NoteSchema);

export default Note;
