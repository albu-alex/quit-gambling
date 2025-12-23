# Quit Gambling App - Visual Architecture & Flow

## App Navigation Flow

```
┌─────────────────────────────────────────────────────────┐
│                    App Initialization                    │
│                  (app/_layout.tsx)                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
        ┌────────────────────────────┐
        │  Is User Onboarded?        │
        │  (useUserStore.isOnboarded)│
        └────┬────────────────┬──────┘
             │                │
            NO               YES
             │                │
             ↓                ↓
    ┌──────────────────┐  ┌──────────────────┐
    │ OnboardingStack  │  │    AppTabs       │
    │ (onboarding/)    │  │   (tabs/)        │
    └──────────────────┘  └──────────────────┘
           │                     │
           ├─ Welcome (/)        ├─ Home (/)
           │  └─ [Shows app         └─ Dashboard
           │     benefits]          └─ Check-in card
           │                        └─ Stats grid
           ├─ Questionnaire
           │  └─ [4 slides]      ├─ Games (/games)
           │     1. Years           ├─ Games hub
           │     2. Frequency       ├─ Memory game
           │     3. Spend           ├─ (Future) Color Match
           │     4. Motivation      └─ (Future) Word Chain
           │
           ├─ Trial Offer       ├─ Friends (/friends)
           │  └─ [Benefits]        ├─ Friend list
           │  └─ CTA buttons       └─ Leaderboard
           │
           └─> recordCheckIn()  ├─ Achievements
               └─> Navigate        ├─ Unlocked badges
                   to AppTabs      └─ Shareable images
                                  
                                  ├─ Settings
                                  ├─ Notifications
                                  ├─ Privacy
                                  └─ About & Logout
```

## Data Flow & State Management

```
┌─────────────────────────────────────────────────────────────┐
│                    React Component                           │
│              (Home, Games, Friends, etc.)                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
        ┌────────────────────────────┐
        │   useUserStore()            │
        │   useSocialStore()          │
        │   useNotificationStore()    │
        │   (Zustand hooks)           │
        └────┬───────────────┬────────┘
             │               │
             ↓               ↓
    ┌─────────────────┐  ┌──────────────────┐
    │  In-Memory      │  │  AsyncStorage    │
    │  State (fast)   │  │  (persistence)   │
    │                 │  │                  │
    │ - currentStreak │  │ - user-store.json│
    │ - friends[]     │  │ - social-store   │
    │ - settings{}    │  │ - notifications  │
    └────────┬────────┘  └────────┬─────────┘
             │                    │
             └─────────┬──────────┘
                       │
                       ↓
        ┌──────────────────────────┐
        │  react-native-keychain   │
        │  (Encrypted Storage)     │
        │                          │
        │ - encryption_key         │
        │ - onboarding_answers     │
        └──────────────────────────┘
```

## Streak Calculation & Check-in Flow

```
┌─────────────────────────────────────────┐
│   App Opened / Day Changed              │
│   shouldPromptCheckIn() = true?         │
└─────────────────────┬───────────────────┘
                      │
                      ↓
         ┌────────────────────────┐
         │  Show Check-in Modal   │
         │  "Did you gamble       │
         │   today?"              │
         └────┬─────────────┬─────┘
              │             │
              NO           YES
              │             │
              ↓             ↓
    ┌──────────────────┐ ┌──────────────────┐
    │ recordCheckIn    │ │ recordCheckIn    │
    │ (gambled=false)  │ │ (gambled=true)   │
    └────────┬─────────┘ └────────┬─────────┘
             │                    │
             ↓                    ↓
    ┌──────────────────┐ ┌──────────────────┐
    │ streak += 1      │ │ streak = 0       │
    │ Update history   │ │ Update history   │
    │ Check milestone  │ │ Show message     │
    └────────┬─────────┘ └────────┬─────────┘
             │                    │
             ↓                    ↓
    ┌──────────────────┐ ┌──────────────────┐
    │ ✅ Congratulations│ │ ⚠️ Streak Reset  │
    │ "Great job!"     │ │ "Recovery is     │
    │                  │ │  possible"       │
    └────────┬─────────┘ └────────┬─────────┘
             │                    │
             └─────────┬──────────┘
                       │
                       ↓
         ┌──────────────────────────┐
         │ Update userStore state   │
         │ Update AsyncStorage      │
         │ Trigger re-render        │
         └──────────────────────────┘
```

## Component Hierarchy

```
App (_layout.tsx)
│
├─ OnboardingStack (if !isOnboarded)
│  ├─ WelcomeScreen
│  │  └─ Button (primary)
│  │
│  ├─ QuestionnaireScreen
│  │  ├─ ProgressBar
│  │  ├─ Slider (x2)
│  │  ├─ TextInput (x2)
│  │  └─ Button (x2: next, previous)
│  │
│  └─ TrialOfferScreen
│     ├─ LinearGradient
│     ├─ Card (x4: benefits)
│     └─ Button (x2)
│
└─ AppTabs (if isOnboarded)
   │
   ├─ Home (index.tsx)
   │  ├─ StreakHeader
   │  │  └─ Card
   │  ├─ CheckInCard
   │  │  └─ Button (x2)
   │  ├─ StatBox (x2)
   │  │  └─ Card
   │  └─ ActionCard (x3)
   │
   ├─ Games (games/index.tsx)
   │  ├─ GameCard (x3)
   │  │  └─ TouchableOpacity
   │  └─ Card (info sections)
   │
   ├─ Games → Memory (games/memory.tsx)
   │  ├─ CardButton (x16)
   │  └─ Button (play again, back)
   │
   ├─ Friends (friends.tsx)
   │  ├─ LeaderboardRow
   │  │  └─ Card
   │  └─ Button (add friend)
   │
   ├─ Achievements (achievements.tsx)
   │  ├─ AchievementCard
   │  │  └─ Card
   │  └─ Button (share)
   │
   └─ Settings (settings.tsx)
      ├─ SettingRow
      │  └─ Card
      ├─ Switch
      └─ Button (logout, delete)
```

## Storage Architecture

```
┌─────────────────────────────────────────────┐
│           LOCAL DEVICE STORAGE              │
├─────────────────────────────────────────────┤
│                                             │
│  AsyncStorage (Plain JSON)                  │
│  ┌───────────────────────────────────────┐ │
│  │ user-store                             │ │
│  │ {                                      │ │
│  │   userId: "uuid...",                   │ │
│  │   isOnboarded: true,                   │ │
│  │   currentStreak: 15,                   │ │
│  │   longestStreak: 45,                   │ │
│  │   checkInHistory: [{...}, ...],        │ │
│  │   lastCheckInDate: "2025-12-22"        │ │
│  │ }                                      │ │
│  └───────────────────────────────────────┘ │
│  ┌───────────────────────────────────────┐ │
│  │ social-store                           │ │
│  │ {                                      │ │
│  │   friends: [{...}, ...],               │ │
│  │   leaderboard: [{...}, ...],           │ │
│  │   incomingRequests: [...]              │ │
│  │ }                                      │ │
│  └───────────────────────────────────────┘ │
│  ┌───────────────────────────────────────┐ │
│  │ notification-store                     │ │
│  │ {                                      │ │
│  │   notificationsEnabled: true,          │ │
│  │   checkInReminderTime: "09:00",        │ │
│  │   scheduledNotifications: [...]        │ │
│  │ }                                      │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  Keychain (Encrypted)                       │
│  ┌───────────────────────────────────────┐ │
│  │ encryption_key                         │ │
│  │ "akd9fj2l9sd8fjlk23..."               │ │
│  │                                      │ │
│  │ user_<UUID>_answers                    │ │
│  │ (AES-256 Encrypted)                    │ │
│  │ {                                      │ │
│  │   yearsGambling: 5,                    │ │
│  │   frequencyPerWeek: 3,                 │ │
│  │   monthlySpend: 2000,                  │ │
│  │   motivation: "..."                    │ │
│  │ }                                      │ │
│  └───────────────────────────────────────┘ │
│                                             │
└─────────────────────────────────────────────┘
              ↓
     [Syncs to Backend]
              ↓
┌─────────────────────────────────────────────┐
│     BACKEND STORAGE (Future: Supabase)      │
├─────────────────────────────────────────────┤
│                                             │
│  Tables:                                    │
│  - users (profile, created_at)              │
│  - streaks (current, longest, last_checkin) │
│  - check_ins (history)                      │
│  - friendships (relationships)              │
│  - achievements (unlocked milestones)       │
│  - game_scores (gameplay stats)             │
│                                             │
└─────────────────────────────────────────────┘
```

## Feature Dependency Map

```
                    ┌─ Base Functionality ─┐
                    │                      │
              ┌─────▼──────┐         ┌─────▼──────┐
              │ User Store │         │ Navigation │
              │ (Profile)  │         │  (Layout)  │
              └─────┬──────┘         └─────┬──────┘
                    │                      │
         ┌──────────┴──────────┐           │
         │                     │           │
    ┌────▼────┐         ┌─────▼──┐        │
    │ Streaks │         │ Storage│        │
    └────┬────┘         └─────────┘        │
         │                                 │
    ┌────▼──────────────────────────┐     │
    │  Streak Calculator / Milestones│    │
    └────┬──────────────────────────┘     │
         │                                 │
    ┌────▼────┬─────────┬──────────┐      │
    │          │         │          │      │
┌───▼──┐ ┌────▼──┐ ┌───▼──┐ ┌─────▼─┐  │
│Games │ │Friends│ │Achieve│ │Settings│  │
└───┬──┘ └────┬──┘ └───┬──┘ └──────┬─┘  │
    │         │        │           │      │
    │    ┌────▼────┐   │      ┌────▼──┐  │
    │    │ Leaderbd│   │      │Notify │  │
    │    └──────────┘   │      └───────┘  │
    │                   │                 │
    └─────┬─────────────┴─────────────────┘
          │
          ↓
    ┌──────────────┐
    │ Rich UX/Analytics │
    │ (future)     │
    └──────────────┘
```

## State Flow Diagram

```
User Action (e.g., "Check In")
        │
        ↓
Component Handler (onPress)
        │
        ├─ Call userStore.recordCheckIn(gambled)
        │        │
        │        ↓
        │    Store Action
        │    ├─ Calculate new streak
        │    ├─ Update history
        │    ├─ Check milestones
        │        │
        │        ↓
        │    set({ currentStreak: new, ... })
        │        │
        ↓        ↓
Re-render      Trigger Zustand Persistence
(immediate)    (AsyncStorage save)
    │               │
    │               ↓
    │          Keychain (optional)
    │               │
    └───────┬───────┘
            │
            ↓
    UI Updates reflect new state
    ├─ StreakHeader shows new number
    ├─ CheckInCard hidden/disabled
    ├─ Milestones trigger animations
    └─ Stats grid recalculates
```

## Error Handling & Recovery

```
                ┌─ Error Occurs ─┐
                │                │
         ┌──────┴──────┐    ┌────┴─────┐
         │ Network     │    │ Local     │
         │ Error       │    │ Error     │
         └──────┬──────┘    └────┬─────┘
                │                │
         ┌──────▼──────┐    ┌────▼─────┐
         │ Offline Mode│    │ Rollback  │
         │ (use local) │    │ to Cache  │
         └──────┬──────┘    └────┬─────┘
                │                │
         ┌──────▼──────────────┬─┘
         │                     │
    ┌────▼─────┐         ┌────▼──┐
    │ Show Error│         │ Retry │
    │ Message  │         │ Action│
    └──────────┘         └──┬────┘
                            │
                    [Exponential Backoff]
                            │
                            ↓
                    [Sync when online]
```

---

This visual architecture makes it easy to:
- Understand data flow
- Add new features
- Debug issues
- Train new developers
- Plan optimizations

**Print this and tape it to your wall!** 📊
