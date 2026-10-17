"""Reusable application index authored with Gramlot Source."""
from .base import Page as GramlotPage


class IndexPage(GramlotPage):
    """Reusable index with grouped navigation, iframe tabs and an overridable footer.

    Supply navigation as groups with key, title and children (key, title, url).
    Pair with a JS module exporting IndexLogic as Logic from @gramlot/gramlot/page.
    """
    title = "Application"
    logo_url = ""
    shell_id = "index"
    css = ("/themes/gramlot-base/theme.css", "/themes/gramlot-index/theme.css")
    navigation = ()

    def main(self, root):
        families = self.navigation
        shell = root.div(class_="index-shell", id=self.shell_id)
        self.header(shell)
        sidebar = shell.aside(class_="index-sidebar", id="index-sidebar")
        brand = sidebar.header()
        if self.logo_url:
            brand.img(src=self.logo_url, alt=self.title, class_="index-logo")
        brand.h1(self.title)
        navigation = sidebar.nav(aria_label="Pages").ul(class_="index-list")
        for family in families:
            category = navigation.li().details(open=family is families[0])
            category.summary(tabindex=-1).a(
                family["title"], id=f"open-{family['key']}", href=f"#panel-{family['key']}",
                class_="index-family", aria_current=None, tabindex=-1)
            examples_list = category.ul(class_="index-list")
            for example in family["children"]:
                examples_list.li().a(example["title"], id=f"open-{example['key']}",
                                    href=example["url"], aria_current=None,
                                    tabindex=-1)
        shell.div(class_="index-divider", id="index-sidebar-divider",
                  role="separator", aria_orientation="vertical", tabindex=0,
                  aria_label="Resize sidebar", aria_controls="index-sidebar",
                  aria_valuemin=120, aria_valuemax=460, aria_valuenow=240)
        content = shell.main(class_="index-main")
        tabs = content.div(class_="index-tabs", role="tablist", aria_label="Open pages")
        tabs.html_button("Introduction", type="button", role="tab", id="tab-intro",
                    aria_controls="panel-intro",
                    aria_selected="true", tabindex=-1, hidden=False)
        for family in families:
            for item in (family, *family["children"]):
                key = item["key"]
                tabs.html_button(item["title"], type="button", role="tab", id=f"tab-{key}",
                            aria_controls=f"panel-{key}",
                            aria_selected="false", tabindex=-1, hidden=True)

        panels = content.div(class_="index-panels")
        intro = panels.section(id="panel-intro", class_="index-intro", role="tabpanel",
                               aria_labelledby="tab-intro", hidden=False)
        self.introduction(intro)

        for family in families:
            key = family["key"]
            category_panel = panels.section(id=f"panel-{key}", class_="index-category",
                                            role="tabpanel",
                                            aria_labelledby=f"tab-{key}", hidden=True)
            self.group_panel(category_panel, family)
            for example in family["children"]:
                self.panel(panels, example)
        footer = shell.footer(class_="index-footer")
        self.footer(footer)
        self.behavior(shell)

    def header(self, shell):
        """Optional application toolbar, declared before navigation and content."""

    def behavior(self, shell):
        shell.dataController(func="indexMount", _onStart=True, shell_id=self.shell_id)

    def introduction(self, pane):
        pane.h2(self.title)
        pane.p("Choose a page from the navigation. Open pages remain available in tabs.")

    def group_panel(self, pane, group):
        pane.h2(group["title"])

    def footer(self, footer):
        """Override to replace; call super().footer(footer) to extend standard controls."""
        theme = footer.div(class_="index-theme")
        theme.html_label("Theme", for_="index-appearance")
        appearance = theme.select(id="index-appearance", value="compact")
        appearance.option("Base", value="base", selected=False)
        appearance.option("Compact", value="compact", selected=True)
        appearance.option("mimi", value="mimi")
        appearance.option("joanna", value="joanna")
        color = footer.div(class_="index-theme")
        color.html_label("Color mode", for_="index-theme")
        choices = color.select(id="index-theme", value="light")
        choices.option("Light", value="light", selected=True)
        choices.option("Dark", value="dark", selected=False)
        keyboard = footer.div(class_="index-keyboard")
        label = keyboard.html_label(for_="keyboard-navigation")
        label.input(type="checkbox", id="keyboard-navigation", checked=False)
        label.span("Keyboard navigation")

        if self.installable:
            app = footer.details(class_="index-install")
            app.summary("Install app")
            app.html_button("Install", type="button", id="index-install-button", hidden=True)
            app.p("", id="index-install-status", role="status")
            app.p("Chrome: use Install page as app in the browser menu. "
                  "Safari on macOS Sonoma or later: File > Add to Dock.")
            app.p("Use HTTPS or localhost. For a static export, serve the directory; "
                  "direct file opening is not installable. Keep the server running for hosted pages.")

    def panel(self, parent, item):
        key = item["key"]
        pane = parent.section(id=f"panel-{key}", class_="index-panel", role="tabpanel",
                              aria_labelledby=f"tab-{key}", hidden=True)
        pane.iframe(id=f"frame-{key}", title=item["title"], name=f"page-{key}")
