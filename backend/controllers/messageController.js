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

    // Get all unique conversations for this user
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', userId] },
              '$receiver',
              '$sender'
            ]
          },
          lastMessage: { $first: '$$ROOT' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: 1,
          user: { $arrayElemAt: ['$user', 0] },
          lastMessage: 1
        }
      }
    ])

    // Remove password from user objects
    const conversations = messages.map(msg => ({
      ...msg,
      user: {
        _id: msg.user._id,
        name: msg.user.name,
        email: msg.user.email,
        bio: msg.user.bio,
        interests: msg.user.interests
      }
    }))

    res.status(200).json(conversations)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}
