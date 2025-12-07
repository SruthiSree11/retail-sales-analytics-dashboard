from flask import Blueprint

from ..controllers.sales_controller import get_sales, get_filters

sales_bp = Blueprint("sales", __name__)

# GET /api/sales
sales_bp.route("/sales", methods=["GET"])(get_sales)

# GET /api/filters
sales_bp.route("/filters", methods=["GET"])(get_filters)
