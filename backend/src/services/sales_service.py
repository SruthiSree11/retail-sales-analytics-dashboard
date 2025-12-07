import math
import sqlite3
import os
from typing import Dict, Any, List
from ..utils.data_loader import DB_PATH

def _normalize_row(row):
    return {
        "transaction_id": row.get("Transaction ID"),
        "date": row.get("Date"),
        "customer_id": row.get("Customer ID"),
        "customer_name": row.get("Customer Name"),
        "phone_number": row.get("Phone Number"),
        "gender": row.get("Gender"),
        "age": row.get("Age"),
        "customer_region": row.get("Customer Region"),
        "customer_type": row.get("Customer Type"),
        "product_id": row.get("Product ID"),
        "product_name": row.get("Product Name"),
        "brand": row.get("Brand"),
        "product_category": row.get("Product Category"),
        "tags": row.get("Tags"),
        "quantity": row.get("Quantity"),
        "price_per_unit": row.get("Price per Unit"),
        "discount_percentage": row.get("Discount Percentage"),
        "total_amount": row.get("Total Amount"),
        "final_amount": row.get("Final Amount"),
        "payment_method": row.get("Payment Method"),
        "order_status": row.get("Order Status"),
        "delivery_type": row.get("Delivery Type"),
        "store_id": row.get("Store ID"),
        "store_location": row.get("Store Location"),
        "salesperson_id": row.get("Salesperson ID"),
        "employee_name": row.get("Employee Name")
    }
def _connect():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def filter_sort_paginate(params: Dict[str, Any]) -> Dict[str, Any]:
    conn = _connect()
    cursor = conn.cursor()

    # Base query + dynamic conditions
    query = "SELECT * FROM sales WHERE 1=1"
    args: List[Any] = []

    # SEARCH
    if params.get("search_name"):
        query += " AND LOWER([Customer Name]) LIKE ?"
        args.append("%" + params["search_name"].lower() + "%")

    if params.get("search_phone"):
        query += " AND LOWER([Phone Number]) LIKE ?"
        args.append("%" + params["search_phone"].lower() + "%")

    # FILTERS
    def add_multi(field, column):
        if params.get(field):
            values = params[field].split(",")
            q_marks = ",".join("?" for _ in values)
            query_ = f" AND [{column}] IN ({q_marks})"
            return query_, values
        return "", []

    q, val = add_multi("customer_region", "Customer Region")
    query += q; args += val

    q, val = add_multi("gender", "Gender")
    query += q; args += val

    q, val = add_multi("product_category", "Product Category")
    query += q; args += val

    q, val = add_multi("payment_method", "Payment Method")
    query += q; args += val

    # Age range
    age_min = params.get("age_min")
    age_max = params.get("age_max")
    if age_min:
        query += " AND Age >= ?"
        args.append(int(age_min))
    if age_max:
        query += " AND Age <= ?"
        args.append(int(age_max))

    # Date range
    if params.get("date_from"):
        query += " AND Date >= ?"
        args.append(params["date_from"])
    if params.get("date_to"):
        query += " AND Date <= ?"
        args.append(params["date_to"])

    # TAGS (special: text search)
    if params.get("tags"):
        tags = params["tags"].split(",")
        for t in tags:
            query += " AND Tags LIKE ?"
            args.append("%" + t + "%")

    # SORTING
    # SORTING
    sort_by = params.get("sort_by", "date")
    sort_order = params.get("sort_order", "desc")
    sort_column_map = {
    "date": "[Date]",
    "quantity": "[Quantity]",
    "customer_name": "[Customer Name]"
    }
    # Prevent invalid sort keys
    if sort_by not in sort_column_map:
        sort_by = "date"
    sort_col = sort_column_map[sort_by]
    query += f" ORDER BY {sort_col} {sort_order.upper()}"


    # PAGINATION
    page = int(params.get("page", 1))
    page_size = int(params.get("page_size", 10))
    offset = (page - 1) * page_size

    # COUNT query
    count_query = "SELECT COUNT(*) FROM (" + query.replace(f" ORDER BY [{sort_col}] {sort_order.upper()}", "") + ")"
    cursor.execute(count_query, args)
    total_items = cursor.fetchone()[0]

    total_pages = max(1, math.ceil(total_items / page_size))

    # Apply LIMIT/OFFSET
    query += " LIMIT ? OFFSET ?"
    args += [page_size, offset]

    cursor.execute(query, args)
    rows = cursor.fetchall()

    items = [_normalize_row(dict(row)) for row in rows]

    # Calculate stats on filtered data only
    stats = _compute_stats(conn, query, args)

    conn.close()

    return {
        "items": items,
        "page": page,
        "page_size": page_size,
        "total_items": total_items,
        "total_pages": total_pages,
        "stats": stats
    }

def _compute_stats(conn, query, args):
    # Remove LIMIT/OFFSET to compute stats on full filtered data
    stat_query = query.split(" LIMIT ")[0]

    stat_sql = f"""
        SELECT 
            SUM(Quantity) as total_quantity,
            SUM([Final Amount]) as total_amount,
            SUM([Total Amount] - [Final Amount]) as total_discount
        FROM ({stat_query})
    """

    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute(stat_sql, args[:-2])  # Remove LIMIT & OFFSET params

    row = cursor.fetchone()

    return {
        "total_quantity": row["total_quantity"] or 0,
        "total_amount": round(row["total_amount"] or 0, 2),
        "total_discount": round(row["total_discount"] or 0, 2)
    }
