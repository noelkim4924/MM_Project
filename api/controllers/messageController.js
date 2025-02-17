import Message from '../models/Message.js';

export const sendMessage = async (req, res) => {
  try{
    const {content,reciverId} = req.body;

    const newMessage = await Message.create({
      sender : req.user._id,
      receiver : reciverId,
      content
  })
  // send the message to the receiver-> socket.io

  res.status(201).json({
    success: true,
    message: newMessage
  })
} catch (error) {
  console.log("Error in sendmessage",error);
  res.status(500).json({
    success: false,
    message: 'Server Error'
  })
}
}

export const getConversation = async (req, res) => {
  const {userId} = req.params;
  try {
    const messages = await Message.find({
      $or: [
        {sender: req.user._id, receiver: userId},
        {sender: userId, receiver: req.user._id}
      ]
    }).sort('createdAt');

    res.status(200).json({
      success: true,
      messages
    })

  } catch (error){
    console.log("Error in getConversation",error);
    res.status(500).json({
      success: false,
      message: 'Server Error'

  })
}
  
}