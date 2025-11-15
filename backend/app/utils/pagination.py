from __future__ import annotations

from collections.abc import Sequence
from math import ceil

from flask import request

DEFAULT_PAGE = 1
DEFAULT_PAGE_SIZE = 10
MAX_PAGE_SIZE = 100


def resolve_pagination_params() -> tuple[int, int]:
    try:
        page = int(request.args.get("page", DEFAULT_PAGE))
    except ValueError:
        page = DEFAULT_PAGE

    try:
        page_size = int(request.args.get("page_size", DEFAULT_PAGE_SIZE))
    except ValueError:
        page_size = DEFAULT_PAGE_SIZE

    page = max(page, 1)
    page_size = max(min(page_size, MAX_PAGE_SIZE), 1)
    return page, page_size


def paginate_query(query, page: int, page_size: int):
    items = query.limit(page_size).offset((page - 1) * page_size).all()
    total = query.order_by(None).count()
    return items, total


def build_paginated_response(
    items: Sequence,
    total: int,
    page: int,
    page_size: int,
):
    pages = ceil(total / page_size) if page_size else 0
    return {
        "data": items,
        "meta": {
            "total": total,
            "page": page,
            "pageSize": page_size,
            "pages": pages,
            "hasNextPage": page < pages,
            "hasPrevPage": page > 1 and pages > 0,
        },
    }
