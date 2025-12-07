# Retail Sales Management System

A full-stack web application for exploring and analyzing retail sales data. Built with Python Flask backend, SQLite database, and vanilla JavaScript frontend with TailwindCSS.

## Features

- Customer search by name or phone number
- Multi-criteria filtering (region, gender, category, tags, payment method, age, date range)
- Sortable columns (date, quantity, customer name)
- Summary statistics (total units, amount, discount)
- Paginated results with navigation controls
- Responsive UI design

## Project Structure

```
root/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── app.py
│   ├── database/
│   ├── data/
│   ├── scripts/
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── index.html
│   │   └── main.js
│   └── README.md
└── docs/
    └── architecture.md
```

## Installation

### Backend Setup

```bash
cd backend
python -m backend.src.app
```

Server runs at: `http://127.0.0.1:5000`

### Frontend Setup

Open `frontend/src/index.html` with a local development server.

Using VS Code Live Server:
- Right-click `index.html`
- Select "Open with Live Server"

Frontend runs at: `http://127.0.0.1:5500`

## API Endpoints

### Get Sales Data

```
GET /api/sales
```

Query Parameters:
- `search_name` - Customer name (partial match)
- `search_phone` - Phone number
- `customer_region` - Filter by region
- `gender` - Filter by gender
- `category` - Product category
- `tags` - Product tags (comma-separated)
- `payment_method` - Payment method
- `age_min` - Minimum age
- `age_max` - Maximum age
- `date_from` - Start date (YYYY-MM-DD)
- `date_to` - End date (YYYY-MM-DD)
- `sort_by` - Column to sort (date, quantity, customer_name)
- `sort_order` - Sort direction (asc, desc)
- `page` - Page number (default: 1)
- `page_size` - Results per page (default: 10)

Response:
```json
{
  "data": [...],
  "total": 1000,
  "page": 1,
  "page_size": 10,
  "total_pages": 100,
  "stats": {
    "total_quantity": 5000,
    "total_amount": 250000.00,
    "total_discount": 12500.00
  }
}
```

### Get Filter Options

```
GET /api/filters
```

Returns available filter values:
```json
{
  "regions": [...],
  "genders": [...],
  "categories": [...],
  "tags": [...],
  "payment_methods": [...]
}
```

## Technical Stack

### Backend
- Python 3.x
- Flask (Web framework)
- SQLite (Database)
- Flask-CORS (Cross-origin support)

### Frontend
- HTML5
- JavaScript (ES6+)
- TailwindCSS (Styling)
- Fetch API (HTTP requests)

## Database Schema

```sql
CREATE TABLE sales (
    id INTEGER PRIMARY KEY,
    date TEXT,
    customer_name TEXT,
    customer_phone TEXT,
    customer_email TEXT,
    customer_age INTEGER,
    customer_region TEXT,
    gender TEXT,
    category TEXT,
    tags TEXT,
    quantity INTEGER,
    unit_price REAL,
    total_amount REAL,
    discount REAL,
    payment_method TEXT
);
```

## Development

### Backend Development

Run in development mode:
```bash
python -m backend.src.app
```

### Frontend Development

The frontend uses no build process. Edit files in `frontend/src/` and refresh the browser.

## Testing

Manual testing checklist:
- Search functionality (name and phone)
- Individual filter application
- Combined filter scenarios
- Sort order changes
- Pagination navigation
- Reset filters behavior
- Edge cases (no results, invalid dates)

## Documentation

Detailed architecture documentation: `docs/architecture.md`
Backend-specific docs: `backend/README.md`
Frontend-specific docs: `frontend/README.md`

## Performance Considerations

- SQLite query optimization for large datasets
- Indexed columns for faster searches
- Pagination to limit response size
- Client-side state management for responsive UI

## Future Enhancements

- Database indexing for text search columns
- Query result caching
- Export functionality (CSV, Excel)
- Advanced analytics and visualizations
- User authentication and authorization
- PostgreSQL migration for production use
- Automated testing suite
- Docker containerization