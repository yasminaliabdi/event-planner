PYTHON = ./venv/bin/python
PIP = ./venv/bin/pip
BLACK = ./venv/bin/black
RUFF = ./venv/bin/ruff

.PHONY: install install-dev fmt fmt-check lint lint-fix

install:
	$(PIP) install -r requirements.txt

install-dev: install
	$(PIP) install -r requirements-dev.txt

fmt:
	$(BLACK) app run.py

fmt-check:
	$(BLACK) --check app run.py

lint:
	$(RUFF) check app run.py

lint-fix:
	$(RUFF) check --fix app run.py

