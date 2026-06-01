from __future__ import annotations

from typing import Any, Dict

from ..model_service import ModelBundle, build_metrics


def get_metrics(bundle: ModelBundle) -> Dict[str, Any]:
    return build_metrics(bundle)
