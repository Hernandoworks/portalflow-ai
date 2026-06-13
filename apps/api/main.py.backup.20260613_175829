from fastapi import FastAPI
from core.router import route_action
from core.permissions import check_permission
from core.audit import log_action

app = FastAPI(title="PortalFlow Action Gateway")

@app.post('/execute')
def execute(request: dict):
    permission = check_permission(request)
    if permission != True:
        return {"status":"blocked","reason":permission}

    result = route_action(request)
    log_action(request, result)

    return {
        "system":"PortalFlow",
        "status":"success",
        "result":result
    }
