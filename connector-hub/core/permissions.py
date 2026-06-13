from core.registry import list_commands


def check_permission(request):

    connector = request.get("connector")
    action = request.get("action")

    registry = list_commands()

    # connector validation
    if connector not in registry:
        return f"Unknown connector: {connector}"


    # action validation
    if action not in registry[connector]:
        return f"Unknown action: {action}"


    metadata = registry[connector][action]


    # default safe if metadata empty
    risk = metadata.get(
        "risk",
        "safe"
    )


    if risk == "confirm":
        return "User confirmation required"


    return True
