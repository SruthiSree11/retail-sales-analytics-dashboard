# Backend – Retail Sales Management System

Flask-based REST API with SQLite database for retail sales data management. Provides filtering, sorting, pagination, and statistical aggregation capabilities.

## Features

- REST API endpoints
- Dynamic filtering system
- Multi-select filter support
- Customer search (name and phone)
- Multi-criteria sorting
- Server-side pagination
- Statistical summaries

## Directory Structure

```
backend/
├── src/
│   ├── controllers/
│   │   └── sales_controller.py
│   ├── routes/
│   │   └── sales_routes.py
│   ├── services/
│   │   └── sales_service.py
│   ├── utils/
│   │   ├── data_loader.py
│   │   └── __init__.py
│   ├── __init__.py
│   └── app.py
├── database/
│   └── sales.db
├── data/
│   └── sales.csv
├── scripts/
│   └── create_db.py
└── README.md
```

## Installation

### Dependencies

```bash
pip install flask flask-cors pandas python-dateutil
```

### Running the Server

From the root directory:

```bash
python -m backend.src.app
```

Server runs at: `http://127.0.0.1:5000`

API endpoints are served under: `/api/*`

## Architecture

### Controller Layer
**File:** `src/controllers/sales_controller.py`

Responsibilities:
- Receive HTTP requests
- Validate query parameters
- Invoke service layer
- Return JSON responses

### Service Layer
**File:** `src/services/sales_service.py`

Responsibilities:
- Execute SQL queries
- Apply filters and search conditions
- Handle sorting logic
- Implement pagination
- Calculate statistics

### Data Loading Layer
**File:** `src/utils/data_loader.py`

Responsibilities:
- Load SQLite database
- Fetch filter metadata
- Manage database connections

### Routing Layer
**File:** `src/routes/sales_routes.py`

Responsibilities:
- Map URL patterns to controllers
- Register blueprints

### Application Factory
**File:** `src/app.py`

Responsibilities:
- Initialize Flask application
- Configure CORS
- Register blueprints
- Run development server

## API Endpoints

### Get Sales Data

```
GET /api/sales
```

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| search_name | string | Partial customer name match |
| search_phone | string | Partial phone number match |
| customer_region | string | Comma-separated region values |
| gender | string | Comma-separated gender values |
| age_min | integer | Minimum age filter |
| age_max | integer | Maximum age filter |
| product_category | string | Comma-separated categories |
| tags | string | Comma-separated tag values |
| payment_method | string | Comma-separated payment methods |
| date_from | string | Start date (YYYY-MM-DD) |
| date_to | string | End date (YYYY-MM-DD) |
| sort_by | string | Column name (date, quantity, customer_name) |
| sort_order | string | Sort direction (asc, desc) |
| page | integer | Page number (default: 1) |
| page_size | integer | Results per page (default: 10) |

#### Example Request

```
GET /api/sales?customer_region=East&gender=Female&sort_by=date&sort_order=desc&page=1
```

#### Response Format

```json
{
  "items": [...],
  "page": 1,
  "page_size": 10,
  "total_items": 23822,
  "total_pages": 2383,
  "stats": {
    "total_quantity": 1948893,
    "total_amount": 56384555355.65,
    "total_discount": 1893939248.35
  }
}
```

### Get Filter Options

```
GET /api/filters
```

#### Response Format

```json
{
  "customer_region": ["North", "South", "East", "West"],
  "gender": ["Male", "Female", "Other"],
  "product_category": ["Electronics", "Clothing", ...],
  "tags": ["Premium", "Discount", ...],
  "payment_method": ["Credit Card", "Cash", ...]
}
```

## Filtering Logic

Filters are applied in the following sequence:

### 1. Search Filters

```sql
WHERE LOWER([Customer Name]) LIKE ?
AND LOWER([Phone Number]) LIKE ?
```

### 2. Multi-value Filters

```sql
AND [Customer Region] IN (?, ?, ...)
AND [Gender] IN (?, ?, ...)
```

### 3. Range Filters

```sql
AND Age >= ? AND Age <= ?
AND Date >= ? AND Date <= ?
```

### 4. Tag Filters

Applied with LIKE for partial matches:

```sql
AND Tags LIKE '%tag1%'
AND Tags LIKE '%tag2%'
```

### 5. Sorting

```sql
ORDER BY [Column] ASC/DESC
```

### 6. Pagination

```sql
LIMIT ? OFFSET ?
```

### 7. Statistics

Computed on filtered dataset before pagination:
- Sum of quantity
- Sum of total amount
- Sum of discount

## Database Schema

### Table: sales

```sql
CREATE TABLE sales (
    transaction_id TEXT,
    customer_id TEXT,
    customer_name TEXT,
    phone_number TEXT,
    gender TEXT,
    age INTEGER,
    customer_region TEXT,
    customer_type TEXT,
    product_id TEXT,
    product_name TEXT,
    brand TEXT,
    product_category TEXT,
    tags TEXT,
    quantity INTEGER,
    price_per_unit REAL,
    discount_percentage REAL,
    total_amount REAL,
    final_amount REAL,
    payment_method TEXT,
    order_status TEXT,
    delivery_type TEXT,
    store_id TEXT,
    store_location TEXT,
    salesperson_id TEXT,
    employee_name TEXT,
    date TEXT
);
```

### Database Creation

Generate SQLite database from CSV:

```bash
python backend/scripts/create_db.py
```

## Performance Optimization

### Current Implementation
- SQLite for simplicity and portability
- Single table schema for fast reads
- Server-side pagination to limit response size
- In-memory filter metadata caching

### Potential Optimizations
- Add indexes on frequently filtered columns:
  - customer_name
  - date
  - product_category
  - customer_region
- Migrate to PostgreSQL for concurrent access
- Implement query result caching (Redis)
- Create materialized views for statistics

## Error Handling

The API handles the following error cases:

- Invalid sort column names
- Malformed date formats
- Out-of-range pagination parameters
- Empty result sets
- Database connection errors

Error responses return appropriate HTTP status codes (400, 500) with descriptive messages.

## CORS Configuration

CORS is enabled for all origins:

```python
CORS(app, resources={r"/*": {"origins": "*"}})
```

Allows frontend (port 5500) to communicate with backend (port 5000).

## Testing

### Test Coverage

- Individual filter application
- Combined filter scenarios
- Multi-value filter handling
- Sort functionality (all columns and directions)
- Pagination navigation
- Edge cases (empty results, boundary values)
- Date range validation
- Invalid input handling
- SQL injection prevention

### Manual Testing

Run test queries using:
- Browser
- Postman
- cURL

Example cURL command:

```bash
curl "http://127.0.0.1:5000/api/sales?customer_region=East&page=1&page_size=10"
```

## Deployment

### Preparation Steps

1. Ensure `sales.db` is included in deployment package
2. Set environment variables for production
3. Configure production WSGI server (Gunicorn)
4. Enable HTTPS
5. Update CORS settings for production domain

### Deployment Platforms

Compatible with:
- Railway
- Render
- Heroku
- AWS Elastic Beanstalk
- Google Cloud Run

### Production Configuration

Update `app.py` for production:

```python
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
```

## Code Structure

### sales_controller.py

```python
def get_sales():
    # Extract query parameters
    # Validate inputs
    # Call service layer
    # Return JSON response
```

### sales_service.py

```python
def fetch_sales_data(filters, sort, pagination):
    # Build SQL query
    # Apply filters
    # Execute query
    # Calculate statistics
    # Return formatted results
```

### data_loader.py

```python
def get_db_connection():
    # Return SQLite connection
    
def get_filter_options():
    # Return cached filter metadata
```

## API Response Examples

### Successful Response

```json
{
  "items": [
    {
      "transaction_id": "TXN001",
      "date": "2024-01-15",
      "customer_name": "John Doe",
      "phone_number": "1234567890",
      "quantity": 2,
      "total_amount": 1500.00
    }
  ],
  "page": 1,
  "total_pages": 10,
  "stats": {
    "total_quantity": 150,
    "total_amount": 50000.00,
    "total_discount": 2500.00
  }
}
```

### Error Response

```json
{
  "error": "Invalid date format. Use YYYY-MM-DD",
  "status": 400
}
```