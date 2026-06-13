#!/bin/bash

cd ~/portalflow-ai/apps/api

source .venv/bin/activate

PYTHONPATH=. python3 generators/openapi_generator.py
