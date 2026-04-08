"""
Materials Cost Estimator — MCP Tool: estimate_materials_cost

Calculates granular material costs for a proposed action:
  - Concrete, Steel, Glass per room and per floor structure
  - Foundation premium that scales with building height
  - Returns total cost and whether it fits within budget
"""
from models.building import BuildingState, MaterialsCostBreakdown


# Material cost ratios (per room, in INR)
_ROOM_CONCRETE = 60_000   # 60% of 1L room cost
_ROOM_STEEL = 30_000      # 30%
_ROOM_GLASS = 10_000      # 10%

# Floor structure (shell, no rooms)
_FLOOR_CONCRETE = 300_000
_FLOOR_STEEL = 150_000
_FLOOR_GLASS = 50_000

# Foundation premium per floor (taller = heavier foundation)
_FOUNDATION_PER_FLOOR = 10_000


def estimate_materials_cost(
    action: str,
    params: dict,
    current_state: BuildingState,
) -> tuple[MaterialsCostBreakdown, bool]:
    """
    MCP Tool: estimate_materials_cost
    Input:  { action, params, buildingState }
    Output: (MaterialsCostBreakdown, within_budget: bool)
    """
    concrete = steel = glass = 0
    num_floors = len(current_state.floors)

    if action in ("add_floor", "add_floors"):
        count = params.get("count", 1)
        concrete = (_FLOOR_CONCRETE + _ROOM_CONCRETE) * count  # 1 default room per floor
        steel = (_FLOOR_STEEL + _ROOM_STEEL) * count
        glass = (_FLOOR_GLASS + _ROOM_GLASS) * count
        # Foundation scales with height
        for i in range(count):
            depth = num_floors + i + 1
            concrete += _FOUNDATION_PER_FLOOR * depth

    elif action == "add_rooms":
        count = params.get("count", 1)
        concrete = _ROOM_CONCRETE * count
        steel = _ROOM_STEEL * count
        glass = _ROOM_GLASS * count

    elif action in ("remove_floor", "remove_rooms"):
        # Demolition cost (20% of construction)
        if action == "remove_floor":
            concrete = int((_FLOOR_CONCRETE + _ROOM_CONCRETE) * 0.20)
            steel = int((_FLOOR_STEEL + _ROOM_STEEL) * 0.20)
            glass = int((_FLOOR_GLASS + _ROOM_GLASS) * 0.20)
        else:
            count = params.get("count", 1)
            concrete = int(_ROOM_CONCRETE * count * 0.20)
            steel = int(_ROOM_STEEL * count * 0.20)
            glass = int(_ROOM_GLASS * count * 0.20)

    elif action == "set_budget":
        return MaterialsCostBreakdown(concrete=0, steel=0, glass=0, total=0), True

    total = concrete + steel + glass
    within_budget = total <= current_state.budget.remaining

    return MaterialsCostBreakdown(concrete=concrete, steel=steel, glass=glass, total=total), within_budget


def format_cost(amount: int) -> str:
    """Format cost in Indian number system (lakh notation)."""
    if amount >= 10_00_000:
        return f"₹{amount / 10_00_000:.1f}Cr"
    elif amount >= 1_00_000:
        return f"₹{amount // 1_00_000}L {(amount % 1_00_000) // 1000:02d}K" if amount % 1_00_000 else f"₹{amount // 1_00_000}L"
    elif amount >= 1_000:
        return f"₹{amount // 1000}K"
    return f"₹{amount:,}"
