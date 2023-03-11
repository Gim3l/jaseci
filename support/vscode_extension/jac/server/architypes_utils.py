from lsprotocol.types import SymbolKind


def get_architype_class(type: str) -> SymbolKind:
    kind = SymbolKind.Variable
    if type in ["node", "nodes"]:
        kind = SymbolKind.Class
    if type in ["walker", "walkers"]:
        kind = SymbolKind.Event
    if type in ["edge", "edges"]:
        kind = SymbolKind.Interface
    if type in ["graph", "graphs"]:
        kind = SymbolKind.Namespace
    if type in ["global", "globals"]:
        kind = SymbolKind.Variable

    return kind
