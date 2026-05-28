# Expense Tracker API

A REST API for managing expenses built with Node.js, Express, and MySQL.

## Features

- ➕ Add an expense (amount, category, description)
- 📋 List all expenses
- 🔍 Filter expenses by category
- 🗑 Delete an expense
- 🔍 Get individual expense details

## Stack

- **Language:** JavaScript
- **Framework:** Node.js / Express.js
- **Database:** MySQL
- **Containerization:** Docker & Docker Compose

## Installation

### Local Development (Without Docker)

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/expense-tracker.git
   cd expense-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** (from `.env.example`)
   ```bash
   cp .env.example .env
   ```

4. **Set up MySQL database**
   - Create a database named `expense_tracker`
   - Update `.env` with your database credentials

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Server runs on `http://localhost:5000`

### Using Docker

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Check logs**
   ```bash
   docker-compose logs -f api
   ```

3. **Stop containers**
   ```bash
   docker-compose down
   ```

## API Endpoints

### Health Check
```
GET /health
```

### Add Expense
```
POST /api/expenses
Content-Type: application/json

{
  "amount": 50.00,
  "category": "food",
  "description": "Lunch at restaurant"
}
```

### Get All Expenses
```
GET /api/expenses
```

### Filter by Category
```
GET /api/expenses?category=food
```

### Get Expense by ID
```
GET /api/expenses/1
```

### Delete Expense
```
DELETE /api/expenses/1
```

## Example Usage with Bruno

1. Open Bruno API Client
2. Create new request
3. Test endpoints (examples provided in API Endpoints section)

## Database Schema

```sql
CREATE TABLE expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  amount DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 5000 | Server port |
| DB_HOST | 127.0.0.1 | Database host |
| DB_USER | root | Database username |
| DB_PASSWORD | root | Database password |
| DB_NAME | expense_tracker | Database name |
| NODE_ENV | development | Environment |

## License

MIT
