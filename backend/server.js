const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = {
    origin: ["http://localhost:5173"],
}

app.get("/api", (req, res) => {
    res.json({ test: ["test1", "test2", "test3"] });
});

app.listen(8080, () => {
    console.log("Server started on port 8080");
});