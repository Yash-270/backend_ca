const express = require("express");
const mongoose = require("mongoose");
const Book = require("./bookSchema");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { title, author, category } = req.body;

        // Validate title
        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Title is required"
            });
        }

        const book = await Book.create({
            title,
            author,
            category
        });

        return res.status(201).json({
            message: "Book added successfully",
            book
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});


router.get("/", async (req, res) => {
    try {
        const page = Math.max(
            1,
            parseInt(req.query.page) || 1
        );

        const limit = Math.max(
            1,
            parseInt(req.query.limit) || 10
        );

        const skip = (page - 1) * limit;

        
        const totalRecords = await Book.countDocuments();

  
        const books = await Book.find()
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            message: "Books fetched successfully",
            currentPage: page,
            limit: limit,
            totalRecords: totalRecords,
            totalPages: Math.ceil(totalRecords / limit),
            books: books
        });  

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});



router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { availability } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid book ID"
            });
        }


        if (typeof availability !== "boolean") {
            return res.status(400).json({
                message: "Availability must be true or false"
            });
        }

       
        const book = await Book.findByIdAndUpdate(
            id,
            {
                availability: availability
            },
            {
                new: true,
                runValidators: true
            }
        );

    
        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        return res.status(200).json({
            message: "Book availability updated successfully",
            book
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});

module.exports = router;



