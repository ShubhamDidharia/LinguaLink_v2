import Connection from '../models/Connection.js'
import User from '../models/User.js'

export async function sendConnectionRequest(req, res) {
  try {
    const { receiverId } = req.body
    const senderId = req.user.userId

    if (!receiverId) {
      return res.status(400).json({ error: 'receiverId is required' })
    }

    if (senderId === receiverId) {
      return res.status(400).json({ error: 'Cannot connect with yourself' })
    }

    // Check if receiver exists
    const receiver = await User.findById(receiverId)
    if (!receiver) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Check if connection already exists
    const existingConnection = await Connection.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    })

    if (existingConnection) {
      return res.status(400).json({ error: 'Connection already exists' })
    }

    // Create new connection request
    const connection = new Connection({
      sender: senderId,
      receiver: receiverId,
      status: 'pending'
    })

    await connection.save()
    await connection.populate('sender receiver', '-password')

    res.status(201).json(connection)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export async function getPendingConnections(req, res) {
  try {
    const userId = req.user.userId

    const pending = await Connection.find({
      receiver: userId,
      status: 'pending'
    }).populate('sender', '-password')

    res.status(200).json(pending)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export async function getAcceptedConnections(req, res) {
  try {
    const userId = req.user.userId

    const accepted = await Connection.find({
      $or: [
        { sender: userId, status: 'accepted' },
        { receiver: userId, status: 'accepted' }
      ]
    }).populate('sender receiver', '-password')

    // Extract friends (the other user in each connection)
    const friends = accepted.map(conn => 
      conn.sender._id.toString() === userId ? conn.receiver : conn.sender
    )

    res.status(200).json(friends)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export async function respondToConnectionRequest(req, res) {
  try {
    const { connectionId } = req.params
    const { action } = req.body
    const userId = req.user.userId

    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action' })
    }

    const connection = await Connection.findById(connectionId)
    if (!connection) {
      return res.status(404).json({ error: 'Connection not found' })
    }

    if (connection.receiver.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    if (connection.status !== 'pending') {
      return res.status(400).json({ error: 'Connection request already processed' })
    }

    if (action === 'accept') {
      connection.status = 'accepted'
      connection.acceptedAt = new Date()
    } else {
      connection.status = 'rejected'
      connection.rejectedAt = new Date()
    }

    await connection.save()
    await connection.populate('sender receiver', '-password')

    res.status(200).json(connection)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export async function getConnectionStatus(req, res) {
  try {
    const { otherUserId } = req.params
    const userId = req.user.userId

    const connection = await Connection.findOne({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId }
      ]
    })

    res.status(200).json(connection || null)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}
