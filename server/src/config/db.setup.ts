import mongoose from "mongoose";

await mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost:27017/Summary").then(() => {
    console.log("📢 Summary : MongoDB is connected!");
}).catch((e) => {
    console.log(e);
    console.log("📢 Summary : MongoDB is not connected!");
});

export default mongoose;