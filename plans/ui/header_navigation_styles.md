# Header and Navigation Styles

## 1. Non-Logged-In Pages (Guest/Visitor Experience)

### 1.1 Header Structure
```
┌─────────────────────────────────────────────────────────────────┐
│  Logo                    Navigation                  CTA Button  │
│  [SecureVote AI]    [Features] [How It Works]        [Register]  │
│                     [Security] [Resources]                      │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Header Components

#### Logo
- Position: Left-aligned
- Size: 32px height
- Link: Homepage (/)
- Hover effect: Subtle brightness increase

#### Navigation Menu
- Layout: Horizontal inline navigation
- Spacing: 24px between items
- Style: 
  - Default: Medium body text (#374151)
  - Hover: Primary blue (#2563EB) with underline
  - Active: Primary blue (#2563EB) with bold weight

#### Call-to-Action Button
- Style: Primary button
- Text: "Register to Vote"
- Position: Right-aligned
- Responsive: 
  - Desktop: Full text
  - Mobile: Icon-only (user-plus icon)

### 1.3 Mobile Navigation (Hamburger Menu)
```
☰ Menu
```
- Position: Right-aligned
- Style: Minimal hamburger icon
- Overlay: Full-screen dark overlay with slide-in menu
- Menu items: Stacked vertically with 16px spacing
- CTA: Prominently displayed at top of menu

## 2. Logged-In Pages (Authenticated User Experience)

### 2.1 Header Structure
```
┌─────────────────────────────────────────────────────────────────┐
│  Logo              Page Title             User Menu             │
│  [SecureVote AI]   [Dashboard]    [Avatar] John Doe ▼           │
│                    [Election Name]        Settings  │           │
│                                           Logout    │           │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Header Components

#### Logo
- Position: Left-aligned
- Size: 32px height
- Link: Dashboard (/dashboard)
- Hover effect: Subtle brightness increase

#### Page Contextual Information
- Position: Center-aligned
- Content: 
  - Primary: Page title (e.g., "Dashboard", "Ballot", "Results")
  - Secondary: Context (e.g., election name, progress indicator)
- Style: 
  - Primary: H3 heading style
  - Secondary: Body small muted text

#### User Menu
- Position: Right-aligned
- Trigger: User avatar + name
- Dropdown: 
  - User profile section with avatar and name
  - Divider
  - Navigation items: Dashboard, My Votes, Security Center
  - Divider
  - Utility items: Settings, Help, Logout
- Notifications: Badge indicator for new notifications

### 2.3 Main Navigation (Sidebar)

#### Desktop Sidebar
```
┌─────────────────┐
│ Dashboard       │
│ My Votes        │
│ Security Status │
│ Audit Trail     │
│ Help Center     │
│ Settings        │
└─────────────────┘
```
- Position: Left-fixed sidebar
- Width: 240px
- Style: 
  - Background: White with subtle shadow
  - Icons: 20px line icons
  - Text: Body medium
  - Active state: Primary blue background with white text
  - Hover state: Light gray background
  - Spacing: 8px padding vertically, 16px horizontally

#### Mobile Bottom Navigation
```
┌─────────────────────────────────────────────┐
│  Home  |  Votes  |  Security  |  More      │
│   house  ballot  shield      dots-circle  │
└─────────────────────────────────────────────┘
```
- Position: Fixed bottom bar
- Style: 
  - Background: White with top border
  - Icons: 24px line icons
  - Labels: Caption text
  - Active state: Primary blue icon and text
  - Inactive state: Medium gray icon and text

## 3. Specialized Headers

### 3.1 Voting Page Header
```
┌─────────────────────────────────────────────────────────────────┐
│  Election Name              Progress Indicator          Help     │
│  [November 2025 General]    [3/12 Races Complete]    [?] Icon   │
└─────────────────────────────────────────────────────────────────┘
```
- Context: Election name and progress tracking
- Progress indicator: Visual progress bar with text
- Help: Contextual help icon

### 3.2 Results Page Header
```
┌─────────────────────────────────────────────────────────────────┐
│  Election Name              Live Status             Export      │
│  [November 2025 General]    [Live • Updated 2m ago]  [Download]  │
└─────────────────────────────────────────────────────────────────┘
```
- Context: Election name and live status indicator
- Live status: Animated indicator with last updated time
- Export: Data export options

### 3.3 Admin Header
```
┌─────────────────────────────────────────────────────────────────┐
│  System Name              Admin Tools              User Menu     │
│  [SecureVote AI Admin]   [System Status]          [Avatar]      │
│                          [User Management]        Admin ▼      │
│                          [Election Setup]         Settings     │
│                                           Logout               │
└─────────────────────────────────────────────────────────────────┘
```
- Context: System name and admin tools
- Admin tools: Dropdown with system management options
- User menu: Extended with admin-specific options

## 4. Design Tokens

### 4.1 Header Heights
- Desktop: 64px
- Mobile: 56px
- Admin: 72px

### 4.2 Z-Index Values
- Header: 1000
- Dropdowns: 1010
- Mobile Menu: 1020
- Notifications: 1030

### 4.3 Shadows
- Header: 0 1px 3px rgba(0,0,0,0.1)
- Dropdowns: 0 4px 6px rgba(0,0,0,0.1)
- Mobile Menu: 0 10px 15px rgba(0,0,0,0.2)

### 4.4 Transitions
- Hover effects: 150ms ease
- Dropdowns: 200ms ease
- Mobile menu: 300ms ease

## 5. Accessibility Considerations

### 5.1 Keyboard Navigation
- Tab order: Logo → Navigation → CTA/User Menu
- Arrow keys: Navigate within dropdown menus
- Escape: Close open menus
- Enter/Space: Activate focused elements

### 5.2 Screen Reader Support
- ARIA labels for all interactive elements
- Landmark roles for header and navigation regions
- Live regions for status updates
- Skip links for keyboard users

### 5.3 Focus Management
- Visible focus indicators (2px outline)
- Focus trapping in modal menus
- Return focus after closing menus
- Persistent focus during navigation

## 6. Responsive Behavior

### 6.1 Breakpoint Adjustments
- **Mobile (0-768px)**: 
  - Hamburger menu for navigation
  - Bottom navigation for primary sections
  - Condensed header with icon-only CTA

- **Tablet (769px-1024px)**:
  - Hybrid approach with some desktop elements
  - Collapsible sidebar on certain pages
  - Reduced padding in header

- **Desktop (1025px+)**:
  - Full navigation menus
  - Fixed sidebar for logged-in users
  - Enhanced contextual information in header

### 6.2 Orientation Handling
- Landscape: Maintain desktop-like experience with adjusted spacing
- Portrait: Optimize for touch interaction with larger tap targets

## 7. Performance Considerations

### 7.1 Loading States
- Skeleton loading for header content
- Progressive enhancement for JavaScript features
- Critical CSS for header styles

### 7.2 Asset Optimization
- SVG icons for crisp rendering
- Optimized logo assets for different resolutions
- Lazy loading for non-critical navigation elements

## 8. Security Indicators

### 8.1 Trust Badges
- Visible security status indicators
- Cryptographic verification badges
- Privacy protection indicators

### 8.2 Authentication Status
- Clear indication of logged-in state
- Session expiration warnings
- Multi-factor authentication status