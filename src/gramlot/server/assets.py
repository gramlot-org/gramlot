"""Runtime resources distributed with Gramlot, independent of any HTTP engine."""
from importlib.resources import files


def runtime_asset(name="gramlot.js"):
    """Return a packaged browser asset; never fall back to another checkout."""
    if name not in {"gramlot.js", "standalone.js", "runtime-notices.json"}:
        raise ValueError(f"Unknown Gramlot runtime asset: {name}")
    asset = files("gramlot").joinpath("resources", name)
    if not asset.is_file():
        raise FileNotFoundError(
            f"Missing packaged {name}; build the JavaScript runtime before building the wheel"
        )
    return asset
