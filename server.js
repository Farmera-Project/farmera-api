import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import userRouter from "./src/routes/userRoute.js";
import locationRouter from "./src/routes/locationRoute.js";
import orderRouter from "./src/routes/orderRoute.js";
import deliveryRouter from "./src/routes/deliveryRoute.js";
import productRouter from "./src/routes/productRoute.js";
import analyticsRouter from "./src/routes/analyticsRoute.js";


dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(cors());

// Routes
app.use(userRouter)
app.use(locationRouter)
app.use(orderRouter)
app.use(deliveryRouter)
app.use(productRouter)
app.use(analyticsRouter)

io.on('connection', (socket) => {
    console.log('A user connected');

    // Emit updates when the delivery status changes
    socket.on('updateDeliveryStatus', (orderId, status) => {
        io.emit('deliveryStatusUpdate', { orderId, status });
    })

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    })
})

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Database Connected'))
    .catch((err) => console.log('Database Connection Error', err));

    const PORT = process.env.PORT

    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })