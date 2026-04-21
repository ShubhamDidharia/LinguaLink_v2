# LinguaLink - Testing Checklist

## 🧪 Pre-Deployment Testing

### Backend API Testing

#### Authentication Endpoints
- [ ] `POST /api/auth/signup` - Create new user
  - [ ] Returns user object with _id
  - [ ] Password is hashed
  - [ ] Sets JWT cookie
  - [ ] Validates email uniqueness

- [ ] `POST /api/auth/login` - Login user
  - [ ] Returns user object
  - [ ] Sets JWT cookie
  - [ ] Fails with wrong password
  - [ ] Fails with non-existent email

- [ ] `GET /api/auth/me` - Get current user
  - [ ] Returns user without password
  - [ ] Requires authentication
  - [ ] Returns 404 if user deleted

- [ ] `POST /api/auth/logout` - Logout
  - [ ] Clears JWT cookie
  - [ ] Returns success message

#### User Endpoints
- [ ] `GET /api/users` - Get all users
  - [ ] Returns array of users
  - [ ] Excludes passwords
  - [ ] Requires authentication

- [ ] `GET /api/auth/users/:id` - Get specific user
  - [ ] Returns user data
  - [ ] Public endpoint (no auth required)
  - [ ] Returns 404 for invalid ID

#### Connection Endpoints
- [ ] `POST /api/connections` - Send request
  - [ ] Creates connection with pending status
  - [ ] Prevents duplicate requests
  - [ ] Prevents self-connection
  - [ ] Returns error if receiver not found

- [ ] `GET /api/connections/pending` - Get pending
  - [ ] Returns only pending requests for current user
  - [ ] Populates sender data
  - [ ] Returns empty array if none

- [ ] `GET /api/connections/accepted` - Get friends
  - [ ] Returns only accepted connections
  - [ ] Includes both directions (sender/receiver)
  - [ ] Populates user data

- [ ] `GET /api/connections/status/:id` - Check status
  - [ ] Returns connection if exists
  - [ ] Returns null if no connection
  - [ ] Works for both directions

- [ ] `PUT /api/connections/:id` - Respond to request
  - [ ] Only receiver can accept/reject
  - [ ] Updates status to accepted/rejected
  - [ ] Updates acceptedAt/rejectedAt timestamps
  - [ ] Can't respond twice

#### Message Endpoints
- [ ] `POST /api/messages` - Send message
  - [ ] Only allows messaging connected users
  - [ ] Returns 403 if not connected
  - [ ] Saves message with sender/receiver
  - [ ] Marks as unread initially

- [ ] `GET /api/messages/conversations` - Get all conversations
  - [ ] Returns aggregated conversations
  - [ ] Includes last message and metadata
  - [ ] Sorted by most recent

- [ ] `GET /api/messages/:id` - Get message history
  - [ ] Returns messages between two users
  - [ ] Sorted by creation date
  - [ ] Supports limit parameter
  - [ ] Only for connected users

- [ ] `PUT /api/messages/:id/read` - Mark as read
  - [ ] Updates isRead to true
  - [ ] Sets readAt timestamp
  - [ ] Only affects own received messages

### Frontend UI Testing

#### Authentication Flow
- [ ] **Login Page**
  - [ ] Email input accepts valid email
  - [ ] Password input masks text
  - [ ] Submit button disabled while loading
  - [ ] Error message displays on failure
  - [ ] Successful login redirects to `/discover`
  - [ ] Link to signup works

- [ ] **Signup Page**
  - [ ] Multi-step form works
  - [ ] Step 1: Name, email, password validation
  - [ ] Step 2: Bio optional
  - [ ] Step 3: Interests selection (multi-select)
  - [ ] Step 4: Languages selection
  - [ ] Validation prevents invalid submission
  - [ ] Successful signup redirects to `/discover`
  - [ ] Link to login works

#### Navigation
- [ ] **Sidebar**
  - [ ] Logo is clickable (goes to Discover)
  - [ ] All 6 menu items visible
  - [ ] Active menu item highlighted
  - [ ] User profile section shows current user
  - [ ] User avatar displays first letter
  - [ ] Profile link navigates to own profile
  - [ ] Logout button clears auth and redirects

#### Discover Page
- [ ] Displays recommended language partners
- [ ] Filter logic works (interests + languages)
- [ ] Connect buttons work
- [ ] Connect button changes to "Pending" after click
- [ ] View Profile links work
- [ ] Interest tags display correctly
- [ ] Languages display for each user
- [ ] Empty state shows when no matches
- [ ] Grid layout is responsive

#### Friends Page
- [ ] Displays only accepted connections
- [ ] Friend cards show name, email, bio
- [ ] Chat buttons work
- [ ] View Profile buttons work
- [ ] Empty state shows when no friends
- [ ] Friend count displays correctly

#### Chat Page
- [ ] Left panel shows conversations list
- [ ] Clicking conversation selects it
- [ ] Selected conversation highlighted
- [ ] Right panel shows active chat
- [ ] Previous messages load
- [ ] Messages display with correct styling
  - [ ] Sent messages: right-aligned, indigo background
  - [ ] Received messages: left-aligned, gray background
- [ ] Timestamps display on messages
- [ ] Input field accepts text
- [ ] Send button sends message
- [ ] New message appears in chat
- [ ] Empty state shows when no conversation selected
- [ ] Can use Enter to send
- [ ] Send button disabled with empty message
- [ ] Messages mark as read on open

#### Notifications Page
- [ ] Displays pending connection requests
- [ ] Shows sender name, email, bio
- [ ] View Profile button works
- [ ] Accept button accepts request
- [ ] Reject button rejects request
- [ ] Request disappears after action
- [ ] Empty state shows when no pending

#### Profile Page
- [ ] Displays full user information
- [ ] Shows all interests
- [ ] Shows languages known and learning
- [ ] Premium badge displays if applicable
- [ ] Bio displays fully (not truncated)
- [ ] Avatar displays with gradient
- [ ] For other users:
  - [ ] Connect button shows
  - [ ] Connect button changes state
  - [ ] Chat button shows if connected
  - [ ] Chat button navigates to chat with user
- [ ] For own profile:
  - [ ] Connect button doesn't show
  - [ ] No logout/actions
- [ ] Back button works
- [ ] Profile is public (no auth required)

#### Workspace Page
- [ ] Displays placeholder
- [ ] Shows "Coming Soon" message
- [ ] Icon displays correctly

#### Billing Page
- [ ] Shows 3 pricing tiers
- [ ] Current plan highlighted
- [ ] Feature lists display
- [ ] "Recommended" badge on Pro plan
- [ ] FAQ section displays
- [ ] All buttons display

### Data Flow Testing

#### Connection Request Flow
- [ ] User A sends request to User B
- [ ] User A sees "Pending" button
- [ ] User B sees in Notifications
- [ ] User B accepts
- [ ] Both see "Connected" status
- [ ] Both can now message each other
- [ ] Connection appears in Friends list for both

#### Messaging Flow
- [ ] User A and User B are connected
- [ ] User A sends message
- [ ] Message appears in User A's chat
- [ ] Message appears in User B's chat
- [ ] Timestamp shows correct time
- [ ] Sender bubble on left/right correct
- [ ] Messages persist on reload

#### Smart Matching
- [ ] User with interests: [A, B, C] and learning: [Spanish]
- [ ] User with interests: [A, D, E] and knows: [Spanish]
- [ ] These users appear as matches for each other
- [ ] Users with no overlapping interests don't match
- [ ] Users don't appear if already connected
- [ ] User doesn't appear if they're self

### Responsive Design
- [ ] Desktop (1920px): Full layout works
- [ ] Tablet (768px): Sidebar handles well
- [ ] Mobile (375px): Layout stacks properly
- [ ] Chat on mobile: Clear conversation first
- [ ] All buttons clickable on mobile
- [ ] Text readable on all sizes
- [ ] Images scale properly
- [ ] No horizontal scroll on mobile

### Performance
- [ ] Page load time < 3 seconds
- [ ] Chat loads messages quickly
- [ ] User list loads smoothly
- [ ] No memory leaks on navigation
- [ ] Images are optimized
- [ ] API calls are efficient

### Error Handling
- [ ] Trying to access protected pages without login redirects to login
- [ ] Invalid IDs show friendly error
- [ ] Network errors show appropriate messages
- [ ] Expired tokens refresh automatically
- [ ] Form validation errors display
- [ ] API errors display user-friendly messages
- [ ] Logout works even if API fails

### Browser Compatibility
- [ ] Chrome latest
- [ ] Firefox latest
- [ ] Safari latest
- [ ] Edge latest
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

### Accessibility
- [ ] Links and buttons have proper contrast
- [ ] Images have alt text
- [ ] Form labels associated with inputs
- [ ] Tab order makes sense
- [ ] Focus states visible
- [ ] Icons have text labels
- [ ] Color not only way to convey info

---

## 🔍 Security Checklist

- [ ] Passwords never sent to frontend
- [ ] JWT tokens in HTTP-only cookies
- [ ] CORS properly configured
- [ ] Auth middleware on protected routes
- [ ] Users can't access other users' private data
- [ ] Users can only message connected users
- [ ] Users can only modify own data
- [ ] No SQL injection vulnerabilities
- [ ] Input validation on all endpoints
- [ ] Rate limiting on auth endpoints
- [ ] HTTPS configured in production

---

## 🚀 Deployment Checklist

### Backend
- [ ] Environment variables set
- [ ] Database connection verified
- [ ] JWT secret configured
- [ ] CORS origin configured
- [ ] Error logging setup
- [ ] Database indexes created
- [ ] API docs generated (optional)

### Frontend
- [ ] Build succeeds without warnings
- [ ] API base URL configured
- [ ] Environment variables validated
- [ ] Service worker configured (PWA)
- [ ] Analytics integrated (optional)
- [ ] Error tracking setup (Sentry)

### General
- [ ] All tests pass
- [ ] Code linted
- [ ] No console errors/warnings
- [ ] Documentation complete
- [ ] Commit history clean
- [ ] Database backup strategy
- [ ] Monitoring setup

---

## 📝 Known Limitations & TODO

- [ ] WebSocket not yet integrated (using polling for chat)
- [ ] File uploads not yet supported
- [ ] Video/audio calls require third-party integration
- [ ] Email notifications not implemented
- [ ] Push notifications not implemented
- [ ] Group chat not supported
- [ ] Read receipts UI pending
- [ ] Typing indicators pending
- [ ] User search not implemented
- [ ] Admin dashboard missing

---

## ✅ Final Sign-Off

- [ ] All critical tests passed
- [ ] No blocking issues
- [ ] Performance acceptable
- [ ] Security reviewed
- [ ] Documentation complete
- [ ] Ready for production

---

**Last Updated:** [Current Date]
**Tested By:** [Your Name]
**Status:** Ready for QA
