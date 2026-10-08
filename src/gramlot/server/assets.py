"""Runtime resources distributed with Gramlot, independent of any HTTP engine."""
from importlib.resources import files
import os

DEV_MODES = ("YES", "DEBUG")


def gramlot_dev():
    """Return ``GRAMLOT_DEV``: ``None`` when unset (deploy), ``"YES"`` or ``"DEBUG"``; any other value raises."""
    value = os.environ.get("GRAMLOT_DEV")
    if value is not None and value not in DEV_MODES:
        raise ValueError(f"GRAMLOT_DEV must be unset, YES or DEBUG, not {value!r}")
    return value


def runtime_asset(name=None):
    """Return a packaged browser asset; never fall back to another checkout.

    Without a name, the runtime to serve at the runtime URL: ``gramlot.js`` when
    ``GRAMLOT_DEV=DEBUG``, ``gramlot.min.js`` otherwise.
    """
    if name is None:
        name = "gramlot.js" if gramlot_dev() == "DEBUG" else "gramlot.min.js"
    if name not in {"gramlot.js", "gramlot.min.js", "runtime-notices.json"}:
        raise ValueError(f"Unknown Gramlot runtime asset: {name}")
    asset = files("gramlot").joinpath("resources", name)
    if not asset.is_file():
        raise FileNotFoundError(
            f"Missing packaged {name}; build the JavaScript runtime before building the wheel"
        )
    return asset
