# LinguaLink Navigation & User Flow

## 📍 Main Navigation Map

```
┌─────────────────────────────────────────────────────────┐
│                     LINGUALINK                          │
├─────────────────────────────────────────────────────────┤
│ SIDEBAR              │        MAIN CONTENT AREA         │
├──────────────────────┼─────────────────────────────────┤
│ 🏠 Discover          │ Recommended language partners   │
│                      │ - Smart matching algorithm     │
│                      │ - Connect button               │
│                      │ - View Profile option          │
├──────────────────────┼─────────────────────────────────┤
│ 👥 Friends           │ Your connected friends         │
│                      │ - Friend cards with bio        │
│                      │ - Chat button                  │
│                      │ - View Profile option          │
├──────────────────────┼─────────────────────────────────┤
│ 💬 Chat              │ Split-Screen Messaging         │
│                      │ ┌──────────┬─────────────────┐ │
│                      │ │ Conv.    │ Message bubbles │ │
│                      │ │ List     │ (sent/received) │ │
│                      │ │ (Left)   │ Input field     │ │
│                      │ │          │ (Right)         │ │
│                      │ └──────────┴─────────────────┘ │
├──────────────────────┼─────────────────────────────────┤
│ 💼 Workspace         │ Coming Soon                    │
│                      │ - Collaborative features       │
│                      │ - Group study sessions         │
│                      │ - Resource sharing             │
├──────────────────────┼─────────────────────────────────┤
│ 🔔 Notifications     │ Pending Connection Requests    │
│                      │ - Accept/Reject buttons        │
│                      │ - View Profile option          │
├──────────────────────┼─────────────────────────────────┤
│ 💳 Billing           │ Pricing Plans                  │
│                      │ - Basic (Free)                 │
│                      │ - Pro ($9.99/mo)              │
│                      │ - Premium ($19.99/mo)        │
├──────────────────────┼─────────────────────────────────┤
│ 👤 [User Avatar]     │ (Current user info)            │
│ [User Name]          │                                │
│ [User Email]         │                                │
├──────────────────────┼─────────────────────────────────┤
│ 🚪 Logout            │                                │
└──────────────────────┴─────────────────────────────────┘
```

## 🔄 User Flow Scenarios

### Scenario 1: New User Registration
```
Landing → Signup → Fill Profile (interests, languages, bio)
         → Auto-directed to Discover
         → View recommended language partners
```

### Scenario 2: Connect with Someone
```
Discover → Click "Connect" button
        → Status changes to "Pending"
        → Other user sees in Notifications
        → Other user accepts
        → Both see "Connected" status
        → Both can message each other
```

### Scenario 3: Send Message
```
Friends → Click "Chat" button
       → Directed to Chat page
       → Conversation selected
       → Type message → Click Send
       → Message appears in chat
       → Other user sees notification
       → Other user replies
```

### Scenario 4: View User Profile
```
Discover/Friends/Chat → Click user name or "View Profile"
                     → Full profile view
                     → See all interests, languages
                     → See premium badge if applicable
                     → Can "Connect" or "Chat" from there
```

## 🎯 Key Features by Page

### Discover Page
- **Purpose:** Find language partners
- **Smart Matching:** Only shows users with:
  - Shared interests
  - Complementary languages (you learn what they know)
- **Actions:** 
  - Connect
  - View Profile
- **Status Indicators:** Connected, Pending, New

### Friends Page
- **Purpose:** Manage connections
- **Display:** All accepted connections
- **Actions:**
  - Chat
  - View Profile
- **Empty State:** "No friends yet" with CTA

### Chat Page
- **Purpose:** 1-to-1 messaging
- **Layout:** Split-screen
  - Left: Conversation list (scrollable)
  - Right: Active chat (scrollable)
- **Features:**
  - Message history
  - Read receipts ready
  - Timestamps
  - Auto-scroll to latest message
- **Input Validation:** Can only message connected users

### Notifications Page
- **Purpose:** Manage connection requests
- **Display:** Pending requests
- **Actions:**
  - Accept request
  - Reject request
  - View Profile
- **Auto-clear:** Accepted requests disappear

### Profile Page
- **Purpose:** View user information
- **For Own Profile:**
  - Can see all their info
  - Can edit (future)
- **For Other Profiles:**
  - View profile
  - Send connection request
  - Chat button (if connected)

### Billing Page
- **Purpose:** Show pricing and features
- **Features:**
  - Three pricing tiers
  - Feature comparison
  - FAQ section
  - Current plan display
  - Upgrade CTAs

### Workspace Page
- **Purpose:** Future collaboration
- **Current:** Placeholder
- **Planned:** Group study, resources, collaboration

## 🔐 Permission Model

```
                    Logged Out    Basic User    Premium User
Discover               ✅            ✅             ✅
View Public Profile    ✅            ✅             ✅
Connect/Message        ❌            ✅             ✅
View Chat              ❌            ✅             ✅
Create Group (WIP)     ❌            ❌             ✅
Advanced Features      ❌            Limited        ✅
```

## 📱 Responsive Design

### Desktop (1920px)
- Sidebar: Fixed width (256px)
- Content: Full remaining width
- Chat: 2-column split (25% + 75%)

### Tablet (768px - 1024px)
- Sidebar: Collapsible or drawer
- Content: Adjusted width
- Chat: Might stack on smaller tablets

### Mobile (< 768px)
- Sidebar: Bottom navigation or drawer
- Content: Full width
- Chat: Single column (select chat first)

## 🎨 Design Tokens

### Colors
- **Primary:** Indigo-600 (#4f46e5)
- **Text:** Slate-900 (#0f172a)
- **Background:** Slate-50 (#f8fafc)
- **Cards:** White (#fff)
- **Borders:** Slate-200 (#e2e8f0)

### Shadows
- **Soft:** 0 1px 3px rgba(0,0,0,0.1)
- **Medium:** 0 10px 15px -3px rgba(0,0,0,0.1)

### Typography
- **Font:** Inter (system-ui fallback)
- **Headings:** Bold
- **Body:** Regular
- **Labels:** Medium weight

## 🔗 Important Routes

| Path | Component | Auth Required | Purpose |
|------|-----------|:-------------:|---------|
| `/login` | Login | No | User authentication |
| `/signup` | Signup | No | User registration |
| `/discover` | Discover | Yes | Find language partners |
| `/friends` | Friends | Yes | View connections |
| `/chat` | Chat | Yes | Message hub |
| `/chat/:friendId` | Chat | Yes | Direct message |
| `/profile/:userId` | Profile | No | View user profile |
| `/workspace` | Workspace | Yes | Collaboration tools |
| `/notifications` | Notifications | Yes | Pending requests |
| `/billing` | Billing | Yes | Pricing & plans |

---

**Complete navigation and user experience flow for LinguaLink!**
