from datetime import datetime


def log_action(request, result):

    print({
        "time": str(datetime.now()),
        "request": request,
        "result": result
    })
