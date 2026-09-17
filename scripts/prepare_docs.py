"""Stage documentation without changing the maintained repository sources."""

from pathlib import Path
import shutil


def main():
    root = Path(__file__).resolve().parents[1]
    destination = root / "build" / "docs-source"
    if destination.exists():
        shutil.rmtree(destination)
    destination.mkdir(parents=True)
    shutil.copy2(root / "README.md", destination / "index.md")
    for directory in ("docs", "docs_llm", "ports"):
        shutil.copytree(
            root / directory,
            destination / directory,
            ignore=shutil.ignore_patterns("_build", "__pycache__"),
        )


if __name__ == "__main__":
    main()
