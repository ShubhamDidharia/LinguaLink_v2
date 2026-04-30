import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// Setup paths for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env from backend directory
dotenv.config({ path: path.resolve(__dirname, '../.env') })

import connectDB from '../utils/db.js'
import User from '../models/User.js'
import Connection from '../models/Connection.js'
import Message from '../models/Message.js'
import INTERESTS from '../data/interests.js'

// Load .env from parent (backend) directory
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/duoclick'

function pickRandom(arr, n) {
  const copy = [...arr]
  const result = []
  for (let i = 0; i < Math.min(n, copy.length); i++) {
    const idx = Math.floor(Math.random() * copy.length)
    result.push(copy.splice(idx, 1)[0])
  }
  return result
}

const users = [
  {
    name: 'Alice Chen',
    email: 'a1',
    password: '123456',
    bio: 'Language enthusiast from Berlin. Love travel and music!',
    interests: ['Music', 'Travel', 'Technology'],
    languagesKnown: ['English', 'German'],
    languagesLearning: ['Spanish', 'French']
  },
  {
    name: 'Bob Garcia',
    email: 'b1',
    password: '123456',
    bio: 'Spanish teacher based in Madrid. Let\'s practice together!',
    interests: ['Teaching', 'Sports', 'Culture'],
    languagesKnown: ['Spanish', 'English'],
    languagesLearning: ['Italian', 'Portuguese']
  },
  {
    name: 'Carol Martinez',
    email: 'c1',
    password: '123456',
    bio: 'French speaker learning English. Coffee lover ☕',
    interests: ['Art', 'Coffee', 'Reading'],
    languagesKnown: ['French', 'English'],
    languagesLearning: ['Spanish']
  },
  {
    name: 'David Lee',
    email: 'd1',
    password: '123456',
    bio: 'Japanese student in Tokyo. Love anime and gaming!',
    interests: ['Gaming', 'Anime', 'Technology'],
    languagesKnown: ['English', 'Japanese'],
    languagesLearning: ['Mandarin', 'Korean']
  },
  {
    name: 'Emma Silva',
    email: 'e1',
    password: '123456',
    bio: 'Brazilian Portuguese speaker. Let\'s dance and learn!',
    interests: ['Dance', 'Music', 'Food'],
    languagesKnown: ['Portuguese', 'English', 'Spanish'],
    languagesLearning: ['Italian']
  },
  {
    name: 'Frank Mueller',
    email: 'f1',
    password: '123456',
    bio: 'German developer. Tech nerd and language geek!',
    interests: ['Technology', 'Gaming', 'Science'],
    languagesKnown: ['German', 'English'],
    languagesLearning: ['French', 'Dutch']
  },
  {
    name: 'Grace Park',
    email: 'g1',
    password: '123456',
    bio: 'Korean yoga instructor. Fitness and wellness enthusiast.',
    interests: ['Fitness', 'Wellness', 'Cooking'],
    languagesKnown: ['Korean', 'English'],
    languagesLearning: ['Japanese', 'Spanish']
  },
  {
    name: 'Henry Chen',
    email: 'h1',
    password: '123456',
    bio: 'Mandarin tutor from Shanghai. Professional language coach!',
    interests: ['Teaching', 'Philosophy', 'Traditional Arts'],
    languagesKnown: ['Mandarin', 'English', 'Shanghai dialect'],
    languagesLearning: ['Italian']
  },
  {
    name: 'Isabella Rossi',
    email: 'i1',
    password: '123456',
    bio: 'Italian architect. Love design and culinary arts!',
    interests: ['Architecture', 'Cooking', 'Art'],
    languagesKnown: ['Italian', 'English', 'French'],
    languagesLearning: ['Spanish', 'German']
  },
  {
    name: 'Jack Wilson',
    email: 'j1',
    password: '123456',
    bio: 'American musician. Rock and jazz enthusiast.',
    interests: ['Music', 'Travel', 'Art'],
    languagesKnown: ['English'],
    languagesLearning: ['Spanish', 'Portuguese']
  },
  {
    name: 'Kenji Yamamoto',
    email: 'k1',
    password: '123456',
    bio: 'English conversation partner in Tokyo. Fun and casual!',
    interests: ['Language Exchange', 'Hiking', 'Photography'],
    languagesKnown: ['Japanese', 'English'],
    languagesLearning: ['French', 'Thai']
  },
  {
    name: 'Luna Garcia',
    email: 'l1',
    password: '123456',
    bio: 'Colombian traveler. Exploring the world one language at a time.',
    interests: ['Travel', 'Photography', 'Nature'],
    languagesKnown: ['Spanish', 'English'],
    languagesLearning: ['French', 'Portuguese']
  },
  {
    name: 'Marco Bonetti',
    email: 'm1',
    password: '123456',
    bio: 'Italian business professional in London. Always learning!',
    interests: ['Business', 'Travel', 'Food'],
    languagesKnown: ['Italian', 'English', 'French'],
    languagesLearning: ['German', 'Dutch']
  },
  {
    name: 'Nina Kovalenko',
    email: 'n1',
    password: '123456',
    bio: 'Russian artist living in Berlin. Creative mind!',
    interests: ['Art', 'Design', 'Music'],
    languagesKnown: ['Russian', 'English', 'German'],
    languagesLearning: ['Italian', 'French']
  },
  {
    name: 'Oscar Hansen',
    email: 'o1',
    password: '123456',
    bio: 'Danish entrepreneur. Coffee & code enthusiast ❤️',
    interests: ['Technology', 'Startups', 'Coffee'],
    languagesKnown: ['Danish', 'English', 'German'],
    languagesLearning: ['French', 'Spanish']
  },
  {
    name: 'Petra Novak',
    email: 'p1',
    password: '123456',
    bio: 'Czech language teacher. Patient and friendly!',
    interests: ['Teaching', 'Reading', 'Hiking'],
    languagesKnown: ['Czech', 'English', 'German'],
    languagesLearning: ['Spanish', 'French']
  },
  {
    name: 'Quinn Lee',
    email: 'q1',
    password: '123456',
    bio: 'Singaporean tech worker. Love meeting new people!',
    interests: ['Technology', 'Cooking', 'Travel'],
    languagesKnown: ['English', 'Mandarin', 'Malay'],
    languagesLearning: ['Japanese', 'Korean']
  },
  {
    name: 'Rosa Fernandez',
    email: 'r1',
    password: '123456',
    bio: 'Spanish translator. Perfectionist language lover!',
    interests: ['Writing', 'Literature', 'Travel'],
    languagesKnown: ['Spanish', 'English', 'French', 'Portuguese'],
    languagesLearning: ['German', 'Italian']
  },
  {
    name: 'Stefan Müller',
    email: 's1',
    password: '123456',
    bio: 'German engineer. Precision and clarity in all things!',
    interests: ['Technology', 'Engineering', 'Science'],
    languagesKnown: ['German', 'English', 'Dutch'],
    languagesLearning: ['French', 'Spanish']
  },
  {
    name: 'Tessa Williams',
    email: 't1',
    password: '123456',
    bio: 'British expat in Barcelona. Love languages and culture!',
    interests: ['Culture', 'Reading', 'Wine'],
    languagesKnown: ['English', 'Spanish', 'French'],
    languagesLearning: ['Catalan', 'Italian']
  }
]

const messages = [
  "Hey! How are you doing?",
  "Nice to meet you! Where are you from?",
  "I love learning languages! What's your favorite?",
  "Want to practice together sometime?",
  "That sounds great! Let's start a conversation.",
  "I'm really enjoying our chats!",
  "When are you usually online?",
  "This is so helpful, thanks for teaching me!",
  "Haha, I love your sense of humor!",
  "Let's schedule a video call soon?",
  "I really enjoyed our conversation today.",
  "Your tips are super useful!",
  "Looking forward to our next chat!",
  "You explain things so well!",
  "This exchange is amazing. Thanks so much!"
]

async function seed() {
  try {
    console.log('🌱 Starting database seeding...')
    console.log(`📂 Seed script location: ${__filename}`)
    console.log(`📂 Looking for .env at: ${path.resolve(__dirname, '../.env')}`)
    console.log(`🔑 MONGO_URI: ${MONGO_URI ? '✅ Loaded' : '❌ NOT FOUND'}`)

    if (!MONGO_URI) {
      console.error('❌ Error: MONGO_URI is not defined!')
      console.error('Make sure .env file exists in backend directory with MONGO_URI set')
      console.error('Expected .env location:', path.resolve(__dirname, '../.env'))
      console.error('\nAll environment variables:', Object.keys(process.env).filter(k => k.includes('MONGO')))
      process.exit(1)
    }

    console.log('📡 Connecting to MongoDB...')
    await connectDB(MONGO_URI)

    // Clear existing data
    console.log('🧹 Clearing existing data...')
    await User.deleteMany({})
    await Connection.deleteMany({})
    await Message.deleteMany({})

    // Create users
    console.log('👥 Creating users...')
    const createdUsers = []
    for (const userData of users) {
      const user = new User({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        bio: userData.bio,
        interests: userData.interests,
        languagesKnown: userData.languagesKnown,
        languagesLearning: userData.languagesLearning,
        subscription: Math.random() > 0.7 // ~30% premium users
      })
      await user.save()
      createdUsers.push(user)
      console.log(`✅ Created: ${userData.name} (${userData.email})`)
    }

    // Create connections (friendships)
    console.log('\n🤝 Creating connections...')
    const connections = []
    for (let i = 0; i < createdUsers.length; i++) {
      // Each user connects with 2-4 random other users
      const connectCount = Math.floor(Math.random() * 3) + 2
      const availableUsers = createdUsers.filter((u, idx) => idx !== i)
      const toConnect = pickRandom(availableUsers, connectCount)

      for (const targetUser of toConnect) {
        const connection = new Connection({
          sender: createdUsers[i]._id,
          receiver: targetUser._id,
          status: 'accepted', // Make them all accepted for messaging
          acceptedAt: new Date()
        })
        await connection.save()
        connections.push(connection)
        console.log(`✅ Connected: ${createdUsers[i].name} ↔ ${targetUser.name}`)
      }
    }

    // Create messages between connected users
    console.log('\n💬 Creating messages...')
    for (let i = 0; i < connections.length; i++) {
      const conn = connections[i]
      const messageCount = Math.floor(Math.random() * 5) + 2

      for (let j = 0; j < messageCount; j++) {
        // Alternate who's sending
        const sender = j % 2 === 0 ? conn.sender : conn.receiver
        const receiver = j % 2 === 0 ? conn.receiver : conn.sender
        const msg = messages[Math.floor(Math.random() * messages.length)]
        const createdTime = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Past 7 days

        const message = new Message({
          sender,
          receiver,
          content: msg,
          isRead: Math.random() > 0.3, // 70% read
          createdAt: createdTime
        })
        await message.save()
      }

      if ((i + 1) % 5 === 0) {
        console.log(`✅ Created messages for ${i + 1}/${connections.length} connections`)
      }
    }

    console.log('\n✨ Seeding complete!')
    console.log(`📊 Summary:`)
    console.log(`   - ${createdUsers.length} users created`)
    console.log(`   - ${connections.length} connections created`)
    console.log(`   - Messages created between connected users`)
    console.log('\n🔑 Test credentials:')
    users.slice(0, 5).forEach(u => {
      console.log(`   ${u.email} / ${u.password}`)
    })
    console.log(`   ... and 15 more users`)

    process.exit(0)
  } catch (err) {
    console.error('❌ Seed error:', err.message)
    process.exit(1)
  }
}

seed()
