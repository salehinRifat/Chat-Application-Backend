import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUserSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const users = await User.find({ _id: { $ne: loggedInUserId } }).select(-"password");
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getMessages = async (req, res) => {

    try {
        const { id: userToChatId } = req.params;

        const senderId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: senderId },
            ],
        }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {

    }
}

export const sendMessages = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
       
        let imageURL;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image, {
                upload_preset: "chat_app",
            });
            imageURL = uploadResponse.secure_url;
            const newMessage = new Message({
                senderId,
                receiverId,
                text,
                image: imageURL,
            });
            await newMessage.save();
            // todo : realtime functionality goes here - socket io

            res.status(201).json(newMessage);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}