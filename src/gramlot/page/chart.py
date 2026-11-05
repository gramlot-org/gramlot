"""Python entry point for the shared charts collection Source composition."""
from genro_bag import Bag


class ChartPane:
    """Supply Data Bags; the chartPane component owns the complete browser UI."""

    def __init__(self, parent, *, store, configuration, storepath, datapath,
                 rowMode='attributes', gridId=None, **attributes):
        if not isinstance(store, Bag) or not isinstance(configuration, Bag):
            raise TypeError('ChartPane requires store and configuration Bags')
        if rowMode not in ('attributes', 'values'):
            raise ValueError('rowMode must be attributes or values')
        parent.dataSetter(storepath, store)
        parent.dataSetter(datapath, configuration)
        attributes.setdefault('height', '100%')
        if gridId is not None:
            attributes['gridId'] = gridId
        self.pane = parent.chartPane(storepath=storepath, configpath=datapath,
                                     rowMode=rowMode, **attributes)
