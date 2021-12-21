try:
    from .settings import *  # noqa
except ImportError as e:
    if e.msg == "No module named 'config.settings.settings'":
        from .dev import *  # noqa
    else:
        raise

