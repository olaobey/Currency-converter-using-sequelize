const express = require("express")
const cors = require("cors")
const userRouter = require("./src/api/routes/userRoute")
const convertRouter = require("./src/api/routes/convertRoute")
const app = express()
const PORT = process.env.PORT;
require('dotenv').config();


app.use(express.json());
app.use(cors());
app.use("/user", userRouter)
app.use("/convert", convertRouter);

app.get('/', (req, res) => {
    res.send('Welcome to currency converter API!');
})

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).
    res.json({
        error: err.message
    })
    })

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})