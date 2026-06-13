
class DriveConnector:


    async def run(
        self,
        action,
        payload
    ):

        if action == "file.search":

            return {
                "message":
                "Drive SDK installed. OAuth setup required next."
            }


        return {
            "error":
            f"Unknown Drive action {action}"
        }

