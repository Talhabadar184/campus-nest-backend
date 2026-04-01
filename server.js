const dotenv = require('dotenv');
const { connectDB } = require('./src/db/index.js');
const app = require('./src/app.js');

dotenv.config(); // Load environment variables


// MongoDB Connection
connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(` Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})



