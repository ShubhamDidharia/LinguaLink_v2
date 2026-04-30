import Message from '../models/Message.js'
import Connection from '../models/Connection.js'

export async function sendMessage(req, res) {
  try {
    const { receiverId, content } = req.body
    const senderId = req.user.userId

    if (!receiverId || !content || !content.trim()) {
      return res.status(400).json({ error: 'receiverId and content are required' })
    }

    // Check if users are connected
    const connection = await Connection.findOne({
      $or: [
        { sender: senderId, receiver: receiverId, status: 'accepted' },
        { sender: receiverId, receiver: senderId, status: 'accepted' }
      ]
    })

    if (!connection) {
      return res.status(403).json({ error: 'Not connected with this user' })
    }

    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      content: content.trim()
    })

    await message.save()
    await message.populate('sender receiver', '-password')

    // Emit to receiver's socket room
    const io = req.app.locals.io;
    if (io) {
      io.to(receiverId.toString()).emit('newMessage', message);
    }

    res.status(201).json(message)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export async function getMessages(req, res) {
  try {
    const { otherUserId } = req.params
    const userId = req.user.userId
    const limit = parseInt(req.query.limit) || 50

    // Get conversation between two users
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId }
      ]
    })
      .sort({ createdAt: 1 })
      .limit(limit)
      .populate('sender receiver', '-password')

    res.status(200).json(messages)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export async function markAsRead(req, res) {
  try {
    const { otherUserId } = req.params
    const userId = req.user.userId

    // Mark all messages from otherUserId to userId as read
    const result = await Message.updateMany(
      { sender: otherUserId, receiver: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    )

    res.status(200).json({ modifiedCount: result.modifiedCount })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export async function getConversations(req, res) {
  try {
    const userId = req.user.userId

    // Find all accepted connections for this user
    const connections = await Connection.find({
      $or: [{ sender: userId }, { receiver: userId }],
      status: 'accepted'
    }).populate('sender receiver', '-password')

    if (!connections.length) {
      return res.status(200).json([])
    }

    const conversations = [];

    // For each connection, get the last message and the other user
    for (const conn of connections) {
      const otherUser = conn.sender._id.toString() === userId.toString() ? conn.receiver : conn.sender;
      
      const lastMessage = await Message.findOne({
        $or: [
          { sender: userId, receiver: otherUser._id },
          { sender: otherUser._id, receiver: userId }
        ]
      }).sort({ createdAt: -1 })

      conversations.push({
        _id: conn._id,
        user: {
          _id: otherUser._id,
          name: otherUser.name,
          email: otherUser.email,
          bio: otherUser.bio,
          interests: otherUser.interests
        },
        lastMessage: lastMessage || null,
        updatedAt: lastMessage ? lastMessage.createdAt : conn.updatedAt
      })
    }

    // Sort conversations by last message time, or connection time
    conversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))

    res.status(200).json(conversations)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}
