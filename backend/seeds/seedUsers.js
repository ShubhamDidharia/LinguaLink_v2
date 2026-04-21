import 'dotenv/config'
import connectDB from '../utils/db.js'
import User from '../models/User.js'
import INTERESTS from '../data/interests.js'

const MONGO_URI = process.env.MONGO_URI 

function pickRandom(arr, n) {
  const copy = [...arr]
  const result = []
  for (let i = 0; i < n; i++) {
    if (copy.length === 0) break
    const idx = Math.floor(Math.random() * copy.length)
    result.push(copy.splice(idx, 1)[0])
  }
  return result
}

const people = [
  { name: 'Alice Smith', email: 'alice.smith@example.com' },
  { name: 'Bob Johnson', email: 'bob.johnson@example.com' },
  { name: 'Carol Baker', email: 'carol.baker@example.com' },
  { name: 'Dave Lee', email: 'dave.lee@example.com' },
  { name: 'Eve Martinez', email: 'eve.martinez@example.com' },
  { name: 'Frank Wright', email: 'frank.wright@example.com' },
  { name: 'Grace Kim', email: 'grace.kim@example.com' },
  { name: 'Heidi Clark', email: 'heidi.clark@example.com' },
  { name: 'Ivan Lopez', email: 'ivan.lopez@example.com' },
  { name: 'Judy Turner', email: 'judy.turner@example.com' },
  { name: 'Karl Young', email: 'karl.young@example.com' },
  { name: 'Laura Green', email: 'laura.green@example.com' },
  { name: 'Mallory Adams', email: 'mallory.adams@example.com' },
  { name: 'Neil Baker', email: 'neil.baker@example.com' },
  { name: 'Olivia Perez', email: 'olivia.perez@example.com' },
  { name: 'Peggy Howard', email: 'peggy.howard@example.com' },
  { name: 'Quentin Fox', email: 'quentin.fox@example.com' },
  { name: 'Rita Stone', email: 'rita.stone@example.com' },
  { name: 'Steve Hall', email: 'steve.hall@example.com' },
  { name: 'Tina Brooks', email: 'tina.brooks@example.com' }
]

async function seed() {
  try {
    await connectDB(MONGO_URI)
    console.log('Seeding users...')
    await User.deleteMany({})

    const creations = people.map(async (p, i) => {
      const interests = pickRandom(INTERESTS, 3)
      const langsKnown = i % 3 === 0 ? ['English', 'French'] : ['English']
      const langsLearning = i % 2 === 0 ? ['Spanish'] : ['German']
      const subscription = i % 4 === 0
      const bio = `Hi, I'm ${p.name.split(' ')[0]}. I like ${interests.slice(0,2).join(', ')}.`
      const password = 'Password123!'

      const user = new User({
        name: p.name,
        email: p.email,
        password,
        bio,
        interests,
        languagesKnown: langsKnown,
        languagesLearning: langsLearning,
        subscription
      })

      await user.save()
      console.log('Created', p.email)
      return user
    })

    await Promise.all(creations)
    console.log('Seeding complete.')
    process.exit(0)
  } catch (err) {
    console.error('Seed error', err)
    process.exit(1)
  }
}

seed()
