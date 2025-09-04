# Design System Components Documentation

## 1. Typography Components

### 1.1 Heading Components
```
<H1>Primary Page Heading</H1>
Props: 
- children (string): The heading text
- className (string): Additional CSS classes
- id (string): Element ID for anchoring

<H2>Section Heading</H2>
Props:
- children (string): The heading text
- className (string): Additional CSS classes
- id (string): Element ID for anchoring

<H3>Subsection Heading</H3>
Props:
- children (string): The heading text
- className (string): Additional CSS classes
- id (string): Element ID for anchoring
```

### 1.2 Text Components
```
<BodyLarge>Large body text for emphasis</BodyLarge>
Props:
- children (string): The text content
- className (string): Additional CSS classes
- bold (boolean): Bold text variant

<BodyMedium>Standard body text</BodyMedium>
Props:
- children (string): The text content
- className (string): Additional CSS classes
- bold (boolean): Bold text variant

<BodySmall>Small body text for captions</BodySmall>
Props:
- children (string): The text content
- className (string): Additional CSS classes
- bold (boolean): Bold text variant

<Caption>Smallest text for fine print</Caption>
Props:
- children (string): The text content
- className (string): Additional CSS classes
- bold (boolean): Bold text variant
```

## 2. Color Palette Components

### 2.1 Color Swatch Components
```
<ColorSwatch color="primary-blue" name="Primary Blue" value="#2563EB" />
Props:
- color (string): Color identifier
- name (string): Human-readable color name
- value (string): Hex color value
- size (string): swatch size (small, medium, large)

<ColorPalette>
  <ColorSwatch color="primary-blue" name="Primary Blue" value="#2563EB" />
  <ColorSwatch color="success-green" name="Success Green" value="#10B981" />
  <ColorSwatch color="warning-yellow" name="Warning Yellow" value="#F59E0B" />
  <ColorSwatch color="error-red" name="Error Red" value="#EF4444" />
</ColorPalette>
Props:
- children (ReactNode): ColorSwatch components
- className (string): Additional CSS classes
```

## 3. Spacing Components

### 3.1 Spacing Utility Components
```
<Spacing size="s" />
Props:
- size (string): Spacing size (xxs, xs, s, m, l, xl, xxl)
- direction (string): Apply spacing in specific direction (vertical, horizontal)

<Spacer height="24px" width="100%" />
Props:
- height (string): Height of spacer
- width (string): Width of spacer
```

## 4. Button Components

### 4.1 Primary Button
```
<PrimaryButton 
  onClick={handleClick}
  disabled={false}
  loading={false}
  size="medium"
>
  Click Me
</PrimaryButton>
Props:
- children (ReactNode): Button content
- onClick (function): Click handler
- disabled (boolean): Disabled state
- loading (boolean): Loading state
- size (string): Button size (small, medium, large)
- className (string): Additional CSS classes
- type (string): Button type (button, submit, reset)
```

### 4.2 Secondary Button
```
<SecondaryButton 
  onClick={handleClick}
  disabled={false}
  loading={false}
  size="medium"
>
  Cancel
</SecondaryButton>
Props:
- children (ReactNode): Button content
- onClick (function): Click handler
- disabled (boolean): Disabled state
- loading (boolean): Loading state
- size (string): Button size (small, medium, large)
- className (string): Additional CSS classes
- type (string): Button type (button, submit, reset)
```

### 4.3 Icon Button
```
<IconButton 
  icon="check"
  onClick={handleClick}
  disabled={false}
  variant="primary"
/>
Props:
- icon (string): Icon name
- onClick (function): Click handler
- disabled (boolean): Disabled state
- variant (string): Button variant (primary, secondary, tertiary)
- className (string): Additional CSS classes
- ariaLabel (string): Accessible label
```

## 5. Form Components

### 5.1 Input Field
```
<InputField
  label="Email Address"
  type="email"
  value={email}
  onChange={handleEmailChange}
  placeholder="Enter your email"
  error={emailError}
  required={true}
/>
Props:
- label (string): Field label
- type (string): Input type (text, email, password, etc.)
- value (string): Current value
- onChange (function): Change handler
- placeholder (string): Placeholder text
- error (string): Error message
- required (boolean): Required field
- disabled (boolean): Disabled state
- className (string): Additional CSS classes
```

### 5.2 Checkbox
```
<Checkbox
  label="I agree to the terms"
  checked={agreed}
  onChange={handleAgreeChange}
  error={checkboxError}
/>
Props:
- label (string): Checkbox label
- checked (boolean): Checked state
- onChange (function): Change handler
- error (string): Error message
- disabled (boolean): Disabled state
- className (string): Additional CSS classes
```

### 5.3 Select Menu
```
<SelectMenu
  label="Select Country"
  options={countryOptions}
  value={selectedCountry}
  onChange={handleCountryChange}
  error={countryError}
/>
Props:
- label (string): Select label
- options (array): Array of option objects {value, label}
- value (string): Selected value
- onChange (function): Change handler
- error (string): Error message
- disabled (boolean): Disabled state
- className (string): Additional CSS classes
```

## 6. Card Components

### 6.1 Standard Card
```
<Card>
  <CardHeader title="Card Title" />
  <CardBody>
    <p>Card content goes here</p>
  </CardBody>
  <CardFooter>
    <PrimaryButton>Action</PrimaryButton>
  </CardFooter>
</Card>
Props:
- children (ReactNode): Card content
- className (string): Additional CSS classes
- elevated (boolean): Elevated shadow variant
```

### 6.2 Data Card
```
<DataCard
  title="Voter Registration"
  value="1,247"
  change="+12%"
  icon="user"
  trend="up"
/>
Props:
- title (string): Card title
- value (string): Main value
- change (string): Change indicator
- icon (string): Icon name
- trend (string): Trend direction (up, down, neutral)
- className (string): Additional CSS classes
```

## 7. Navigation Components

### 7.1 Guest Header
```
<GuestHeader>
  <Logo />
  <NavigationMenu>
    <NavLink href="/features">Features</NavLink>
    <NavLink href="/security">Security</NavLink>
    <NavLink href="/resources">Resources</NavLink>
  </NavigationMenu>
  <RegisterButton />
</GuestHeader>
Props:
- children (ReactNode): Header components
- className (string): Additional CSS classes

### 7.2 Authenticated Header
```
<AuthenticatedHeader>
  <Logo />
  <PageContext 
    title="Dashboard" 
    subtitle="November 2025 General Election" 
  />
  <UserMenu 
    name="John Doe" 
    avatarUrl="/avatars/john-doe.jpg"
    notifications={3}
  />
</AuthenticatedHeader>
Props:
- children (ReactNode): Header components
- className (string): Additional CSS classes

### 7.3 Page Context
```
<PageContext 
  title="Ballot" 
  subtitle="3/12 Races Complete" 
  status="in-progress"
/>
Props:
- title (string): Page title
- subtitle (string): Contextual subtitle
- status (string): Status indicator (optional)
- className (string): Additional CSS classes

### 7.4 Sidebar Navigation
```
<SidebarNavigation>
  <SidebarItem icon="dashboard" href="/dashboard">Dashboard</SidebarItem>
  <SidebarItem icon="vote" href="/votes">My Votes</SidebarItem>
  <SidebarItem icon="security" href="/security">Security Status</SidebarItem>
  <SidebarItem icon="audit" href="/audit">Audit Trail</SidebarItem>
</SidebarNavigation>
Props:
- children (ReactNode): Sidebar items
- className (string): Additional CSS classes
```

## 8. Specialized Components

### 8.1 Agent Status Component
```
<AgentStatus
  agentName="Registration Agent"
  status="active"
  tasks={1247}
  uptime="99.8%"
/>
Props:
- agentName (string): Name of the agent
- status (string): Current status (active, inactive, error)
- tasks (number): Number of tasks processed
- uptime (string): Uptime percentage
- className (string): Additional CSS classes
```

### 8.2 Neural Network Visualization
```
<NeuralNetworkDisplay
  health="optimal"
  nodes={100}
  connections={500}
  status="active"
/>
Props:
- health (string): Network health status
- nodes (number): Number of nodes
- connections (number): Number of connections
- status (string): Current status
- className (string): Additional CSS classes
```

### 8.3 Security Status Component
```
<SecurityStatus
  level="maximum"
  features={["Post-quantum crypto", "Anonymous routing", "Zero-knowledge proofs"]}
  lastScan="5 minutes ago"
/>
Props:
- level (string): Security level
- features (array): Array of active security features
- lastScan (string): Timestamp of last security scan
- className (string): Additional CSS classes
```

## 9. Layout Components

### 9.1 Grid System
```
<Grid columns={3} gap="m" responsive={true}>
  <GridItem>
    <Card>Content 1</Card>
  </GridItem>
  <GridItem>
    <Card>Content 2</Card>
  </GridItem>
  <GridItem>
    <Card>Content 3</Card>
  </GridItem>
</Grid>
```
Props:
- children (ReactNode): Grid items
- columns (number): Number of columns
- gap (string): Spacing between items (xxs, xs, s, m, l, xl, xxl)
- responsive (boolean): Enable responsive column adjustment
- minColumnWidth (string): Minimum column width for responsive grids
- className (string): Additional CSS classes

### 9.2 Grid Item
```
<GridItem columnSpan={2} rowSpan={1}>
  <Card>Wide Content</Card>
</GridItem>
```
Props:
- children (ReactNode): Grid item content
- columnSpan (number): Number of columns to span
- rowSpan (number): Number of rows to span
- alignSelf (string): Vertical alignment (start, center, end)
- justifySelf (string): Horizontal alignment (start, center, end)
- className (string): Additional CSS classes

### 9.3 Container Component
```
<Container size="large">
  <h1>Page Content</h1>
  <p>Page content goes here</p>
</Container>
Props:
- children (ReactNode): Container content
- size (string): Container size (small, medium, large, full)
- className (string): Additional CSS classes
```

## 10. Utility Components

### 10.1 Loading Spinner
```
<LoadingSpinner 
  size="medium" 
  message="Loading..." 
  visible={isLoading}
/>
Props:
- size (string): Spinner size (small, medium, large)
- message (string): Loading message
- visible (boolean): Visibility control
- className (string): Additional CSS classes
```

### 10.2 Notification Component
```
<Notification
  type="success"
  message="Your vote has been recorded"
  onClose={handleClose}
  autoDismiss={true}
  dismissTime={5000}
/>
Props:
- type (string): Notification type (success, error, warning, info)
- message (string): Notification message
- onClose (function): Close handler
- autoDismiss (boolean): Auto-dismiss after time
- dismissTime (number): Time in ms before auto-dismiss
- className (string): Additional CSS classes
```