from flask import request, jsonify
from typing import Any, Dict

from ..services.sales_service import filter_sort_paginate
from ..utils.data_loader import get_filter_metadata


def get_sales() -> Any:
    """
    Controller for GET /api/sales.
    Reads query params, delegates to service, returns JSON response.
    """
    query_params: Dict[str, Any] = dict(request.args)
    result = filter_sort_paginate(query_params)
    return jsonify(result)


def get_filters() -> Any:
    """
    Controller for GET /api/filters.
    Returns distinct values for filter dropdowns.
    """
    metadata = get_filter_metadata()
    return jsonify(metadata)
