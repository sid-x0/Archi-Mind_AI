from fastapi import APIRouter
from models.building import BuildingState
from state.store import store

router = APIRouter()


@router.get("/state", response_model=BuildingState)
async def get_state() -> BuildingState:
    """Return the current authoritative building state."""
    return store.get()


@router.post("/reset", response_model=BuildingState)
async def reset_building() -> BuildingState:
    """Reset the building to its initial empty state."""
    return store.reset()
