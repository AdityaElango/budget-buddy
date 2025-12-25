# 💰 BudgetBuddy - Personal Finance Management System

<div align="center">

![BudgetBuddy](https://img.shields.io/badge/BudgetBuddy-Finance%20Tracker-2563eb?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

*A comprehensive full-stack expense tracking and budget management application*

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [API Documentation](#-api-documentation) • [Contributing](#-contributing)  

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Frontend Architecture](#-frontend-architecture)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**BudgetBuddy** is a modern, full-featured personal finance management application designed to help users track expenses, manage budgets, analyze spending patterns, and achieve savings goals. Built with the MERN stack (MongoDB, Express.js, React, Node.js), it offers an intuitive interface with powerful analytics and real-time insights.

### Why BudgetBuddy?

- **Complete Financial Overview**: Track all income and expenses in one place
- **Smart Analytics**: Visual charts and insights to understand spending patterns
- **Budget Management**: Set and monitor category-wise budgets with alerts
- **Savings Goals**: Create and track progress toward financial goals
- **Tag System**: Organize transactions with custom tags (#travel, #emergency, etc.)
- **Recurring Transactions**: Automate tracking of regular income/expenses
- **Export Reports**: Download monthly summaries and transaction reports as CSV
- **Dark Mode**: Professional dark theme for comfortable viewing
- **Mobile Responsive**: Works seamlessly on desktop, tablet, and mobile devices

---

## ✨ Features

### 🔐 Authentication & Security
- Secure user registration and login with JWT tokens
- Password hashing with bcrypt
- Session management with HTTP-only cookies
- Protected routes with authentication middleware

### 💳 Transaction Management
- **Add Expenses & Income**: Quick form with category, amount, description, date, and tags
- **List View**: Filterable and searchable transaction list
- **Bulk Operations**: Select multiple transactions to recategorize or delete
- **Category Icons**: Visual icons for quick category identification
- **Tags Support**: Add custom tags to transactions for better organization
- **Export to CSV**: Download transaction data for offline analysis

### 📊 Dashboard
- **Financial Health Score**: Algorithm-based scoring (0-100) based on income, savings, and budget adherence
- **Monthly Overview**: Quick summary of income, expenses, and net savings
- **Quick Add**: Add transactions without leaving the dashboard
- **Account Balances**: Real-time balance tracking across multiple accounts
- **Recent Transactions**: View latest financial activities

### 📈 Analytics & Insights
- **Weekly Trends**: Line charts showing income vs. expenses over time
- **Category Breakdown**: Pie chart showing spending distribution by category
- **Savings Trend**: Cumulative savings visualization
- **Income vs. Expense Comparison**: Bar chart for weekly comparisons
- **Smart Insights**: AI-powered recommendations based on spending patterns
- **Monthly Reports**: Downloadable CSV summaries with top expenses

### 💼 Budget Management
- **Category Budgets**: Set monthly budget limits for each spending category
- **Visual Progress**: Color-coded progress bars (green, yellow, red)
- **Budget Alerts**: Notifications when approaching or exceeding budget limits
- **Month-over-Month Tracking**: Compare budget performance across months

### 🔄 Recurring Transactions
- **Automated Tracking**: Set up recurring income or expenses
- **Flexible Frequency**: Daily, weekly, or monthly recurrence
- **Live Preview**: See next transaction details before saving
- **Pause/Resume**: Temporarily disable recurring items
- **Next Run Date**: Clear visibility of upcoming transactions

### 🎯 Savings Goals
- **Goal Tracking**: Create multiple savings goals with target amounts and deadlines
- **Progress Visualization**: Color-coded progress bars showing completion percentage
- **Quick Updates**: One-tap buttons to add/subtract amounts (+1k, +5k, -1k)
- **Deadline Reminders**: Visual indicators for goal deadlines
- **Local Storage**: Goals persist client-side for instant access

### 🏦 Accounts Management
- **Multiple Accounts**: Track balances across Savings, Cash, Card, and custom accounts
- **Account Insights**: See percentage of total wealth and month-over-month changes
- **Transaction Filtering**: View transactions by specific account

### 🌙 User Experience
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Mobile-first design that works on all screen sizes
- **Loading States**: Skeleton loaders for better perceived performance
- **Toast Notifications**: Non-intrusive feedback for user actions
- **Month/Year Selector**: Global date filter in navigation bar
- **Empty States**: Helpful guidance when no data exists

---

## 🛠 Technology Stack

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB
- **JWT**: JSON Web Tokens for authentication
- **Bcrypt.js**: Password hashing
- **Cookie-Parser**: Parse cookies in requests
- **CORS**: Cross-Origin Resource Sharing middleware
- **Dotenv**: Environment variable management
- **Validator**: String validation and sanitization

### Frontend
- **React**: UI library for building component-based interfaces
- **React Router**: Client-side routing
- **Recharts**: Charting library for data visualization
- **Framer Motion**: Animation library for smooth transitions
- **Material-UI**: React components for faster development
- **Axios**: HTTP client for API requests
- **Context API**: State management
- **CSS Modules**: Scoped styling

### Development Tools
- **Nodemon**: Auto-restart server during development
- **Create React App**: React project scaffolding
- **ESLint**: Code linting
- **Prettier**: Code formatting

---

## 📁 Project Structure

```
expense-tracker/
│
├── client/                          # React frontend
│   ├── public/
│   │   ├── index.html              # HTML template
│   │   ├── manifest.json           # PWA manifest
│   │   └── robots.txt              # SEO robots file
│   │
│   ├── src/
│   │   ├── api/                    # API service layer
│   │   │   ├── api.js             # Axios instance with interceptors
│   │   │   ├── authApi.js         # Auth-related API calls
│   │   │   ├── accountApi.js      # Account API calls
│   │   │   ├── budgetApi.js       # Budget API calls
│   │   │   ├── expenseApi.js      # Expense API calls
│   │   │   ├── incomeApi.js       # Income API calls
│   │   │   └── healthApi.js       # Health score API calls
│   │   │
│   │   ├── components/            # React components
│   │   │   ├── About/            # Landing page
│   │   │   ├── Accounts/         # Account management page
│   │   │   ├── Analysis/         # Analytics dashboard
│   │   │   ├── Auth/             # Authentication provider
│   │   │   ├── Budget/           # Budget management page
│   │   │   ├── Common/           # Reusable components
│   │   │   │   ├── Button.js
│   │   │   │   ├── Card.js
│   │   │   │   ├── EmptyState.js
│   │   │   │   ├── Loader.js
│   │   │   │   └── ProtectedRoute.js
│   │   │   ├── Context/          # React Context providers
│   │   │   │   ├── Context.js    # Login & Date contexts
│   │   │   │   └── ThemeContext.js
│   │   │   ├── Dashboard/        # Main dashboard
│   │   │   ├── Goals/            # Savings goals page
│   │   │   ├── Header.js         # Navigation header
│   │   │   ├── Login/            # Login page
│   │   │   ├── Recurring/        # Recurring transactions
│   │   │   ├── Signup/           # Registration page
│   │   │   ├── Toast/            # Toast notification system
│   │   │   └── Transaction/      # Transaction management
│   │   │
│   │   ├── utils/                # Utility functions
│   │   │   └── exportUtils.js   # CSV export helpers
│   │   │
│   │   ├── App.js               # Main App component
│   │   ├── App.css              # Global styles
│   │   ├── index.js             # React entry point
│   │   ├── index.css            # Base CSS with theme variables
│   │   └── logo_icon.png        # App logo
│   │
│   ├── .env.local               # Environment variables (API URL)
│   └── package.json             # Frontend dependencies
│
├── server/                       # Express backend
│   ├── controllers/             # Business logic
│   │   ├── account/
│   │   │   └── accountCtrl.js   # Account operations
│   │   ├── budget/
│   │   │   └── budgetCtrl.js    # Budget CRUD operations
│   │   ├── expense/
│   │   │   └── expenseCtrl.js   # Expense CRUD with tags
│   │   ├── income/
│   │   │   └── incomeCtrl.js    # Income CRUD with tags
│   │   └── recurring/
│   │       └── recurringCtrl.js # Recurring transaction logic
│   │
│   ├── db/
│   │   └── conn.js              # MongoDB connection
│   │
│   ├── middleware/
│   │   └── authenticate.js      # JWT auth middleware
│   │
│   ├── models/                  # Mongoose schemas
│   │   ├── accountSchema.js     # Account model
│   │   ├── budgetSchema.js      # Budget model
│   │   ├── expenseSchema.js     # Expense model with tags
│   │   ├── incomeSchema.js      # Income model with tags
│   │   ├── recurringSchema.js   # Recurring transaction model
│   │   └── userSchema.js        # User model with auth
│   │
│   ├── routes/                  # API routes
│   │   ├── router.js            # Main router with auth routes
│   │   ├── account/
│   │   │   └── accountRoutes.js
│   │   ├── budget/
│   │   │   └── budgetRoutes.js
│   │   ├── expense/
│   │   │   └── expenseRoutes.js
│   │   ├── income/
│   │   │   └── incomeRoutes.js
│   │   └── recurring/
│   │       └── recurringRoutes.js
│   │
│   ├── scripts/
│   │   └── smoke.js             # API smoke tests
│   │
│   ├── utils/
│   │   └── healthScoreCalc.js   # Financial health algorithm
│   │
│   ├── app.js                   # Express app configuration
│   ├── .env                     # Environment variables
│   └── package.json             # Backend dependencies
│
└── README.md                    # This file
```

---

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14.0.0 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **npm** or **yarn** package manager
- **Git** - [Download](https://git-scm.com/downloads)

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/expense-tracker.git
cd expense-tracker
```

### Step 2: Install Backend Dependencies

```bash
cd server
npm install
```

### Step 3: Install Frontend Dependencies

```bash
cd ../client
npm install
```

---

## ⚙️ Configuration

### Backend Configuration

1. Create a `.env` file in the `server/` directory:

```bash
cd server
touch .env  # On Windows: type nul > .env
```

2. Add the following environment variables:

```env
# MongoDB Connection
MONGO_URI=mongodb://127.0.0.1:27017/expense-tracker
# Or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker

# JWT Secret Key (use a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production

# Server Port
PORT=5001
```

### Frontend Configuration

1. Create a `.env.local` file in the `client/` directory:

```bash
cd client
touch .env.local  # On Windows: type nul > .env.local
```

2. Add the API URL:

```env
# Backend API URL
REACT_APP_API_URL=http://localhost:5001/api
```

### MongoDB Setup

#### Option 1: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS (with Homebrew)
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```
3. MongoDB will run on `mongodb://127.0.0.1:27017` by default

#### Option 2: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Add your IP address to the whitelist
4. Create a database user
5. Get your connection string and update `MONGO_URI` in `.env`

---

## 🎮 Usage

### Starting the Application

#### Development Mode

1. **Start the Backend Server** (Terminal 1):
```bash
cd server
npm start
# Or use nodemon for auto-restart:
npm run dev
```
Server will run on `http://localhost:5001`

2. **Start the Frontend** (Terminal 2):
```bash
cd client
npm start
```
React app will open automatically at `http://localhost:3000`

#### Production Build

1. Build the React frontend:
```bash
cd client
npm run build
```

2. Serve the build with Express (configure in server):
```javascript
// In server/app.js
app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
```

### Using the Application

#### 1. **Registration & Login**
- Navigate to `http://localhost:3000`
- Click "Sign Up" and create an account
- Login with your credentials
- JWT token is stored in HTTP-only cookie

#### 2. **Dashboard**
- View your financial health score (0-100)
- See monthly summary (income, expenses, savings)
- Quick-add transactions
- View account balances

#### 3. **Adding Transactions**
- Go to "Transaction" page
- Select Expense or Income
- Fill in:
  - Category (required)
  - Account Type (required)
  - Description (required)
  - Amount (required)
  - Date (required)
  - Tags (optional, comma-separated: `#travel, #emergency`)
- Click "Add Transaction"

#### 4. **Managing Budgets**
- Go to "Budget" page
- Set monthly budget for each category
- View progress bars (green < 75%, yellow 75-100%, red > 100%)
- Get alerts when exceeding budgets

#### 5. **Analyzing Spending**
- Go to "Analysis" page
- View charts:
  - Weekly income vs. expense trends
  - Category-wise spending (pie chart)
  - Cumulative savings
- Read AI-generated insights
- Download monthly CSV summary

#### 6. **Setting Savings Goals**
- Go to "Goals" page
- Create a goal with:
  - Name (e.g., "Emergency Fund")
  - Target amount (e.g., 50000)
  - Deadline date
  - Initial saved amount (optional)
- Track progress with visual bars
- Quick update buttons (+1k, +5k, -1k)

#### 7. **Recurring Transactions**
- Go to "Recurring" page
- Set up monthly rent, salary, subscriptions
- Choose frequency (Daily, Weekly, Monthly)
- Pause/resume as needed
- See next run date

#### 8. **Exporting Data**
- **Transactions**: Click "Export" on Transaction page
- **Monthly Summary**: Click "Download Summary" on Analysis page
- Files download as CSV format

#### 9. **Theme Toggle**
- Click moon (🌙) icon in header for dark mode
- Click sun (☀️) icon for light mode
- Preference saved in localStorage

---

## 📡 API Documentation

### Base URL
```
http://localhost:5001/api
```

### Authentication Endpoints

#### POST `/signup`
Register a new user
```json
Request:
{
  "fname": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "cpassword": "password123"
}

Response (201):
{
  "status": 201,
  "storeData": {
    "_id": "user_id",
    "fname": "John Doe",
    "email": "john@example.com"
  }
}
```

#### POST `/login`
Login user
```json
Request:
{
  "email": "john@example.com",
  "password": "password123"
}

Response (201):
{
  "status": 201,
  "result": {
    "userValid": { ...user object },
    "token": "jwt_token_string"
  }
}
```

#### GET `/validuser`
Validate current user session (requires auth)
```json
Response (201):
{
  "status": 201,
  "ValidUserOne": { ...user object }
}
```

### Expense Endpoints

#### POST `/expense`
Create expense
```json
Request:
{
  "category": "Food",
  "amount": 500,
  "description": "Lunch at restaurant",
  "account": "Cash",
  "date": "2025-12-25",
  "user": "user_id",
  "tags": ["travel", "dining"]  // Optional
}

Response (200):
{
  "_id": "expense_id",
  "category": "Food",
  "amount": 500,
  ...
}
```

#### GET `/expense/user/:userid`
Get all expenses for a user

#### PUT `/expense/:id`
Update expense

#### DELETE `/expense/:id`
Delete expense

### Income Endpoints

#### POST `/income`
Create income (similar to expense)

#### GET `/income/user/:userid`
Get all income for a user

#### PUT `/income/:id`
Update income

#### DELETE `/income/:id`
Delete income

### Budget Endpoints

#### POST `/budget`
Create/update budget
```json
Request:
{
  "category": "Food",
  "amount": 10000,
  "month": 12,
  "year": 2025,
  "user": "user_id"
}
```

#### GET `/budget/:month/:year/:userId`
Get budgets for specific month/year

### Account Endpoints

#### GET `/account/balance/:userId/:month/:year`
Get account balances for month

### Recurring Endpoints

#### POST `/recurring`
Create recurring transaction
```json
Request:
{
  "category": "Salary",
  "amount": 50000,
  "frequency": "Monthly",
  "dayOfMonth": 1,
  "account": "Savings",
  "description": "Monthly salary",
  "user": "user_id",
  "active": true
}
```

#### GET `/recurring/user/:userId`
Get all recurring transactions for user

#### PUT `/recurring/:id`
Update recurring transaction

#### DELETE `/recurring/:id`
Delete recurring transaction

### Health Score Endpoint

#### GET `/health-score?month=12&year=2025`
Get financial health score (requires auth)
```json
Response (201):
{
  "status": 201,
  "score": 75,
  "breakdown": {
    "savingsRate": 30,
    "budgetAdherence": 20,
    "expenseRatio": 25
  }
}
```

---

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  fname: String (required),
  email: String (required, unique),
  password: String (hashed, required),
  cpassword: String (hashed, required),
  tokens: [{ token: String }],
  createdAt: Date,
  updatedAt: Date
}
```

### Expenses Collection
```javascript
{
  _id: ObjectId,
  category: String (required),
  description: String (required),
  account: String (required),
  amount: Number (required),
  date: Date (required),
  tags: [String],  // Optional tags
  user: ObjectId (ref: 'users'),
  type: String (default: 'expense'),
  createdAt: Date,
  updatedAt: Date
}
```

### Incomes Collection
```javascript
{
  _id: ObjectId,
  category: String (required),
  description: String (required),
  account: String (required),
  amount: Number (required),
  date: Date (required),
  tags: [String],  // Optional tags
  user: ObjectId (ref: 'users'),
  type: String (default: 'income'),
  createdAt: Date,
  updatedAt: Date
}
```

### Budgets Collection
```javascript
{
  _id: ObjectId,
  category: String (required),
  amount: Number (required),
  month: Number (required, 1-12),
  year: Number (required),
  user: ObjectId (ref: 'users'),
  createdAt: Date,
  updatedAt: Date
}
```

### Recurring Collection
```javascript
{
  _id: ObjectId,
  category: String (required),
  description: String (required),
  account: String (required),
  amount: Number (required),
  frequency: String (required), // 'Daily', 'Weekly', 'Monthly'
  dayOfMonth: Number,
  active: Boolean (default: true),
  user: ObjectId (ref: 'users'),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🏗️ Frontend Architecture

### Component Hierarchy
```
App
├── Header (Navigation)
├── Route: About (Landing)
├── Route: Login
├── Route: Signup
└── ProtectedRoute
    ├── Dashboard
    ├── Accounts
    ├── Transaction
    ├── Budget
    ├── Recurring
    ├── Analysis
    └── Goals
```

### State Management
- **LoginContext**: User authentication state
- **DateContext**: Global month/year selector
- **ThemeContext**: Dark mode toggle
- **ToastContext**: Notification system

### Key Libraries
- **Recharts**: Charts (LineChart, PieChart, BarChart)
- **Framer Motion**: Page transitions
- **Material-UI**: Avatar component
- **React Router**: Client-side routing

---

## 🌐 Deployment

### Deploy to Heroku

1. **Prepare for deployment**:
```bash
# In server/app.js, serve React build
app.use(express.static(path.join(__dirname, '../client/build')));
```

2. **Create Heroku app**:
```bash
heroku create budgetbuddy-app
```

3. **Set environment variables**:
```bash
heroku config:set MONGO_URI="your_mongodb_atlas_uri"
heroku config:set JWT_SECRET="your_secret_key"
```

4. **Deploy**:
```bash
git push heroku main
```

### Deploy to Vercel (Frontend Only)

1. Build the React app:
```bash
cd client
npm run build
```

2. Deploy with Vercel CLI:
```bash
npm i -g vercel
vercel
```

3. Update API URL in frontend to point to deployed backend

### Deploy to AWS / DigitalOcean

1. Set up a Ubuntu server
2. Install Node.js, MongoDB, and PM2
3. Clone repository and install dependencies
4. Configure environment variables
5. Use PM2 to run server:
```bash
pm2 start server/app.js --name budgetbuddy
pm2 startup
pm2 save
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. **MongoDB Connection Error**
```
❌ MongoDB connection failed: connect ECONNREFUSED
```
**Solution**:
- Ensure MongoDB is running: `mongod` or `brew services start mongodb-community`
- Check `MONGO_URI` in `.env`
- For Atlas, whitelist your IP address

#### 2. **CORS Error in Browser**
```
Access to fetch at 'http://localhost:5001/api/...' has been blocked by CORS
```
**Solution**:
- Verify CORS origins in `server/app.js` match frontend URL
- Check cookies are enabled for localhost

#### 3. **Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::5001
```
**Solution**:
```bash
# Find process using port
lsof -i :5001  # macOS/Linux
netstat -ano | findstr :5001  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

#### 4. **React App Won't Start**
```
npm ERR! missing script: start
```
**Solution**:
- Ensure you're in `client/` directory
- Run `npm install` to restore dependencies
- Check `package.json` has `"start": "react-scripts start"`

#### 5. **JWT Token Expired**
```
401 Unauthorized
```
**Solution**:
- Logout and login again
- Tokens expire after 1 day (configurable in `userSchema.js`)

#### 6. **Tags Not Showing**
- Ensure backend controllers accept `tags` parameter
- Check frontend sends `tags: parseTags(tags)` in API calls
- Verify transaction mapping includes `tags: item.tags || []`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**:
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Code Style Guidelines
- Use ESLint and Prettier for consistent formatting
- Write meaningful commit messages
- Add comments for complex logic
- Update README for new features
- Write tests for new endpoints

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Authors

- **Your Name** - *Initial work* - [GitHub Profile](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- MongoDB for database
- React community for excellent documentation
- Recharts for beautiful visualizations
- All contributors and testers

---

## 📞 Support

For support, email your-email@example.com or open an issue in the GitHub repository.

---

<div align="center">

**Made with ❤️ and ☕**

⭐ Star this repo if you found it helpful!

</div>
