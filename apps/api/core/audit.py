from datetime import datetime


def log_action(request, result):
    event = {
        'timestamp': str(datetime.utcnow()),
        'request': request,
        'result': result
    }
    print(event)
    return event
