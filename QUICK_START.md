# 🚀 LinguaLink - Quick Start Guide

## Installation & Setup

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=4000
MONGO_URI=mongodb://your_mongo_connection_string
JWT_SECRET=your_very_secret_key_change_this
FRONTEND_ORIGIN=http://localhost:5173
NODE_ENV=development
EOF

# Start backend
npm run dev
```

Backend runs on `http://localhost:4000`

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env.local file (optional - defaults work)
cat > .env.local << EOF
VITE_API_BASE=http://localhost:4000
EOF

# Start development server
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 🎯 Quick Test Flow

### Test User 1
- Email: `alice@example.com`
- Password: `password123`
- Interests: Music, Travel, Technology
- Languages: English (knows), Spanish (learning)

### Test User 2
- Email: `bob@example.com`
- Password: `password123`
- Interests: Technology, Gaming, Music
- Languages: Spanish (knows), English (learning)

### Test Scenario
1. Sign up as Alice in one browser window
2. Sign up as Bob in another browser window
3. Alice goes to Discover → finds Bob → clicks Connect
4. Bob goes to Notifications → sees Alice's request → Accepts
5. Alice goes to Friends → clicks Chat on Bob
6. Start conversation between Alice and Bob

---

## 📁 Project Structure

```
linguaLink_NewV/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── connectionController.js (NEW)
│   │   └── messageController.js (NEW)
│   ├── models/
│   │   ├── User.js
│   │   ├── Connection.js (NEW)
│   │   └── Message.js (NEW)
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── connectionRoutes.js (NEW)
│   │   └── messageRoutes.js (NEW)
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── utils/
│   │   └── db.js
│   ├── data/
│   │   └── interests.js
│   ├── index.js (UPDATED)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MainLayout.jsx (NEW)
│   │   │   ├── Sidebar.jsx (NEW)
│   │   │   ├── UserCard.jsx (UPDATED)
│   │   │   ├── DiscoverUserCard.jsx (NEW)
│   │   │   └── MultiSelect.jsx
│   │   ├── pages/
│   │   │   ├── Discover.jsx (NEW)
│   │   │   ├── Friends.jsx (NEW)
│   │   │   ├── Chat.jsx (NEW)
│   │   │   ├── Workspace.jsx (NEW)
│   │   │   ├── Notifications.jsx (NEW)
│   │   │   ├── Billing.jsx (NEW)
│   │   │   ├── Profile.jsx (UPDATED)
│   │   │   ├── Login.jsx (UPDATED)
│   │   │   ├── Signup.jsx (UPDATED)
│   │   │   └── Home.jsx (DEPRECATED)
│   │   ├── services/
│   │   │   └── api.js (UPDATED)
│   │   ├── App.jsx (UPDATED)
│   │   ├── main.jsx
│   │   └── index.css (UPDATED)
│   ├── tailwind.config.js (NEW)
│   ├── postcss.config.js (NEW)
│   ├── vite.config.js (NEW)
│   ├── index.html
│   └── package.json (UPDATED)
│
├── IMPLEMENTATION_SUMMARY.md (NEW)
├── NAVIGATION_GUIDE.md (NEW)
├── TESTING_CHECKLIST.md (NEW)
└── QUICK_START.md (THIS FILE)
```

---

## 🔌 API Endpoints Reference

### Auth (No auth required for signup/login)
```
POST   /api/auth/signup           - Register new user
POST   /api/auth/login            - Login user
POST   /api/auth/logout           - Logout
GET    /api/auth/me               - Get current user (auth required)
GET    /api/auth/users/:id        - Get user by ID (public)
```

### Connections (Auth required)
```
POST   /api/connections                  - Send connection request
GET    /api/connections/pending          - Get pending requests
GET    /api/connections/accepted         - Get friends
GET    /api/connections/status/:id       - Check connection status
PUT    /api/connections/:connectionId    - Accept/reject request
```

### Messages (Auth required)
```
POST   /api/messages                     - Send message
GET    /api/messages/conversations       - Get all conversations
GET    /api/messages/:userId             - Get chat history
PUT    /api/messages/:userId/read        - Mark messages as read
```

### Utilities
```
GET    /api/interests                    - Get available interests
GET    /api/users                        - Get all users (auth required)
```

---

## 🎨 Customization

### Change Primary Color
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  indigo: {
    600: '#YOUR_COLOR_HEX', // Change here
  }
}
```

### Change Font
Edit `frontend/tailwind.config.js`:
```javascript
fontFamily: {
  sans: ['Your Font', 'fallback'],
}
```

### Adjust Page Layout
Each page component uses `MainLayout` wrapper. Edit `frontend/src/components/MainLayout.jsx`

### Modify Sidebar Items
Edit `frontend/src/components/Sidebar.jsx` - array of `menuItems`

---

## 🐛 Troubleshooting

### Backend Issues

**Connection refused to port 4000**
- Ensure MongoDB is running
- Check `MONGO_URI` in `.env`
- Verify no other process using port 4000

**JWT errors**
- Make sure `JWT_SECRET` is set in `.env`
- Clear browser cookies and re-login

**CORS errors**
- Verify `FRONTEND_ORIGIN` matches your frontend URL
- Check `withCredentials: true` in API service

### Frontend Issues

**Can't connect to backend**
- Verify backend is running on port 4000
- Check `VITE_API_BASE` environment variable
- Check network tab in DevTools

**Tailwind styles not applying**
- Run `npm install` in frontend directory
- Restart dev server
- Clear browser cache

**Components not rendering**
- Check browser console for errors
- Verify component imports are correct
- Check route path in App.jsx

### General Issues

**Can't login after signup**
- Verify user was created (check MongoDB)
- Check password was entered correctly
- Clear localStorage and cookies

**Chat not loading messages**
- Ensure users are connected (check Connections in DB)
- Verify messages exist for conversation
- Check browser console for errors

---

## 🧹 Clean Up & Maintenance

### Reset Database
```bash
# Delete all data and restart
db.dropDatabase()
```

### Clear Frontend Build Cache
```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### View Logs
```bash
# Backend logs appear in terminal where `npm run dev` is running
# Frontend logs appear in browser console (F12)
```

---

## 📚 Documentation Files

- **IMPLEMENTATION_SUMMARY.md** - Detailed technical documentation
- **NAVIGATION_GUIDE.md** - UI/UX flow and user journeys
- **TESTING_CHECKLIST.md** - Comprehensive testing guide
- **QUICK_START.md** - This file

---

## 🎓 Learning Resources

### Tailwind CSS
- https://tailwindcss.com/docs
- https://tailwindcss.com/components

### Lucide React Icons
- https://lucide.dev
- Icon list: https://lucide.dev/icons

### React
- https://react.dev
- https://react.dev/learn

### MongoDB
- https://docs.mongodb.com
- https://mongoosejs.com

---

## 🤝 Contributing

### Code Style
- Use ES6+ syntax
- Components should be functional with hooks
- Use meaningful variable names
- Comment complex logic
- Keep files modular and focused

### Before Committing
```bash
# Format code
npm run format  # (if available)

# Check for errors
npm run lint    # (if available)

# Test locally
# Run through testing checklist
```

---

## 📈 Performance Tips

1. **Images**: Optimize and compress before uploading
2. **Bundle Size**: Check with `npm run build` and analyze
3. **Database**: Add indexes for frequently queried fields
4. **Caching**: Implement Redis for sessions (future)
5. **API**: Use pagination for large lists
6. **Frontend**: Lazy load components for better performance

---

## 🔒 Security Reminders

- 🚫 Never commit `.env` files
- 🚫 Never expose JWT_SECRET
- 🚫 Always hash passwords
- ✅ Validate all user inputs
- ✅ Use HTTPS in production
- ✅ Implement rate limiting
- ✅ Keep dependencies updated

---

## 📞 Support

For issues or questions:
1. Check TESTING_CHECKLIST.md
2. Review IMPLEMENTATION_SUMMARY.md
3. Check browser console for errors
4. Check backend terminal logs
5. Review MongoDB logs if available

---

**LinguaLink is ready to go! Happy coding! 🚀**

Last Updated: 2026-04-21
