from fastapi import FastAPI
from pydantic import BaseModel

from core.router import router
from core.permissions import check_permission
from core.audit import log_action
from core.registry import list_commands


app = FastAPI(
    title="PortalFlow Action Gateway",
    version="0.1.0"
)

@app.post("/system/generate-openapi")
def generate_schema():

    from generators.openapi_generator import generate_openapi

    generate_openapi()

    return {
        "status":"generated"
    }

class ActionRequest(BaseModel):
    connector: str
    action: str
    payload: dict = {}


@app.get("/health")
def health():

    return {
        "status": "online",
        "system": "PortalFlow AI"
    }


@app.get("/commands")
def commands():

    return {
        "system": "PortalFlow AI",
        "registry": list_commands()
    }


@app.post("/execute")
async def execute(
    request: ActionRequest
):

    data = request.model_dump()

    permission = check_permission(data)

    if permission is not True:

        return {
            "status": "blocked",
            "reason": permission
        }


    result = await router.execute(
        request.connector,
        request.action,
        request.payload
    )


    log_action(
        data,
        result
    )


    return {
        "system": "PortalFlow",
        "status": "success",
        "result": result
    }
