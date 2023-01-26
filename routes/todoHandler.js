const express = require('express');
const checkLogin = require('../middlewares/checkLogin');
const Todo = require('../schemas/todoSchema');
const router = express.Router();

// GET ALL THE TODO'S
router.get("/", checkLogin, async (req, res) => {
    console.log(req.username);
    console.log(req.userId);
    try {
        // normal find with all field data which exist in DB
        // const todo = await Todo.find({ status: "active" });

        // find method with customization, here we don't want id,and date value, and for this the code will like that
        const todo = await Todo.find({ status: "active" }).select({
            _id: 0,
            date: 0
        }).limit(2);
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.status(200).json({ message: "All todo's based on query", todo });
    } catch (error) {
        res.status(500).json({ error: "There was a server side error" });
    }
})

// GET A TODO BY ID
router.get("/:id", async (req, res) => {
    try {
        const todo = await Todo.find({ _id: req.params.id }).select({
            _id: 0,
            date: 0,
        });
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.status(200).json({ message: "todo based on query", todo });
    } catch (error) {
        res.status(500).json({ error: "There was a server side error" });
    }
})

// POST A TODO
router.post("/", async (req, res) => {
    try {
        const newTodo = await new Todo(req.body);
        await newTodo.save();
        if (!newTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.status(200).json({ message: "A new todo was saved", newTodo });
    } catch (error) {
        res.status(500).json({ error: "There was a server side error" });
    }
});

// POST MULTIPLE TODO
router.post("/all", async (req, res) => {
    await Todo.insertMany(req.body, (err) => {
        if (err) {
            res.status(500).json({
                error: "There was a server side error!"
            });
        } else {
            res.status(200).json({
                message: "Todo's were inserted successfully!"
            })
        }
    })
})

// UPDATE A TODO
router.put("/:id", async (req, res) => {
    // await Todo.updateOne({ _id: req.params.id }, {};
    try {
        const todo = await Todo.findByIdAndUpdate(req.params.id, {
            $set: {
                status: 'active',
                title: req.body.title,
            },
        }, { new: true });
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.status(200).json({ message: "Todo updated successfully", todo });
    } catch (err) {
        res.status(500).json({ error: "There was a server side error" });
    }
});

// DELETE A TODO
router.delete("/:id", async (req, res) => {
    try {
        const todo = await Todo.deleteOne({ _id: req.params.id });
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.status(200).json({ message: "todo was deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "There was a server side error" });
    }
})

module.exports = router;