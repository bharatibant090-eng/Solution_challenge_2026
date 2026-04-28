VOLUNTEER_MAP = VOLUNTEER_MAP = {
    "food": "Volunteer A",
    "medical": "Volunteer B",
    "rescue": "Volunteer C",
    "utilities": "Volunteer E",   # ← new
    "other": "Volunteer D",
}


def assign_volunteer(request_type: str) -> str:
    """Return the assigned volunteer name based on request type."""
    return VOLUNTEER_MAP.get(request_type, "Volunteer D")