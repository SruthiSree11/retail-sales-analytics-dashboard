# Frontend – Retail Sales Management System

This directory contains the frontend implementation of the Retail Sales Management System. Built with HTML, Vanilla JavaScript (ES Modules), and TailwindCSS for a clean dashboard interface.

## Features

- Dynamic search functionality
- Multi-select dropdown filtering
- Date and range filtering
- Multi-criteria sorting
- Paginated table display
- Summary statistics cards
- Filter reset capability

## Directory Structure

```
frontend/
├── src/
│   ├── index.html
│   ├── main.js
│   ├── components/
│   │   ├── dropdown.js
│   │   ├── table.js
│   │   ├── pagination.js
│   │   └── filters.js
│   ├── services/
│   │   └── api.js
│   └── styles/
│       └── style.css
└── README.md
```

## Running the Frontend

### Using VS Code Live Server

1. Open the project in VS Code
2. Right-click `src/index.html`
3. Select "Open with Live Server"

The application will run at: `http://127.0.0.1:5500`

Live Server is required to support ES module imports.

### Backend Dependency

Ensure the Flask backend is running at: `http://127.0.0.1:5000`

## API Communication

All API calls are handled in `src/services/api.js`

### Configuration

```javascript
const API_BASE = "http://127.0.0.1:5000/api";
```

### API Calls Triggered By

- Page load
- Filter changes
- Dropdown selections
- Sort changes
- Search input
- Pagination navigation
- Reset button

## State Management

Application state is maintained in `main.js`:

```javascript
let appState = {
    search_name: "",
    customer_region: "",
    gender: "",
    age_min: "",
    age_max: "",
    product_category: "",
    tags: "",
    payment_method: "",
    date_from: "",
    date_to: "",
    sort_by: "date",
    sort_order: "desc",
    page: 1,
    page_size: 10
};
```

State updates trigger `updateStateAndReload()` to fetch new data.

## Components

### Multi-select Dropdowns (`dropdown.js`)

Implements custom dropdown functionality for:
- Region
- Gender
- Product Category
- Tags
- Payment Method

### Table Rendering (`table.js`)

Displays sales data with columns:
- Transaction ID
- Date (YYYY-MM-DD)
- Customer ID
- Customer Name
- Phone Number
- Gender
- Age
- Product Category
- Quantity

Features:
- INR currency formatting
- Sticky header
- Hover effects
- Loading/empty/error states

### Pagination (`pagination.js`)

Features:
- Numbered page buttons
- Previous/Next navigation
- Ellipsis for large page ranges
- Active page highlighting

### Statistics Display (`table.js`)

Shows real-time statistics:
- Total Units Sold
- Total Amount
- Total Discount

Updates automatically with filter changes.

## Filter System

### Multi-select Filters

Implemented via custom dropdowns in `dropdown.js`:
- Checkbox-based selection
- Multiple values per filter
- Visual selected state

### Input Filters

Implemented in `main.js`:
- Age range (min/max)
- Date range (from/to)
- Customer name search
- Phone number search

### Sort Controls

Dropdown-based sorting:
- Date (newest/oldest)
- Quantity (high to low / low to high)
- Customer name (A-Z / Z-A)

## Reset Functionality

Reset button clears:
- All dropdown selections
- Age and date ranges
- Search inputs
- Sort settings
- Pagination state

Implementation in `main.js`:

```javascript
document.getElementById("filters-reset").addEventListener("click", resetFilters);
```

## Testing Coverage

Tested scenarios:
- Single and combined filter application
- Multi-tag selection behavior
- Sort order changes
- Pagination navigation
- Reset functionality
- Search with partial matches
- Zero-results handling
- Rapid filter changes
- API error handling

## Technical Details

### Dependencies

- TailwindCSS (CDN)
- No JavaScript frameworks
- Native ES6 modules

### Browser Compatibility

Requires modern browser with ES6 module support:
- Chrome 61+
- Firefox 60+
- Safari 11+
- Edge 16+

### CSS Framework

TailwindCSS loaded via CDN:
```html
<script src="https://cdn.tailwindcss.com"></script>
```

## Deployment

### Environment Configuration

Update API base URL in `src/services/api.js`:

```javascript
const API_BASE = "https://your-backend-url.com/api";
```

### Compatible Platforms

- Netlify
- Vercel
- GitHub Pages (with ES module support)
- Any static hosting service

## File Descriptions

### `index.html`
Main HTML structure with:
- Sidebar navigation
- Filter controls
- Statistics cards
- Data table
- Pagination controls

### `main.js`
Application initialization and state management:
- State object definition
- Event listeners
- Filter update logic
- API coordination

### `components/dropdown.js`
Multi-select dropdown component:
- Dropdown creation
- Selection handling
- State synchronization

### `components/table.js`
Table rendering logic:
- Data row generation
- Statistics display
- Empty state handling
- Error display

### `components/pagination.js`
Pagination component:
- Page button generation
- Navigation handlers
- Ellipsis logic for large page counts

### `services/api.js`
API communication layer:
- Fetch sales data
- Fetch filter options
- Query parameter construction
- Error handling

## Code Patterns

### Module Imports
```javascript
import { fetchSalesData, fetchFilters } from './services/api.js';
import { renderTable, renderStats } from './components/table.js';
```

### State Updates
```javascript
function updateStateAndReload() {
    appState.page = 1;
    loadData();
}
```

### Error Handling
```javascript
try {
    const data = await fetchSalesData(params);
    renderTable(data);
} catch (error) {
    console.error('Error:', error);
    displayError();
}
```

## Performance Considerations

- Debounced search input to reduce API calls
- Pagination limits data transfer
- Efficient DOM updates
- Minimal re-renders

## Known Limitations

- No offline support
- No data caching
- Limited to single user session
- No authentication layer