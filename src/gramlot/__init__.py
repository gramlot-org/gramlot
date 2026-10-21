"""Describe application interfaces in Python; let a JavaScript runtime handle interaction in the browser."""
from .page import GramlotBuilder, Page, endpoint, source
from .renderer import GramlotHtmlRenderer, GramlotSvgRenderer

__all__ = ["GramlotBuilder", "GramlotHtmlRenderer", "GramlotSvgRenderer", "Page", "FramePage", "IndexPage", "endpoint", "source"]

from .page.frame_page import FramePage
from .page.index_page import IndexPage
