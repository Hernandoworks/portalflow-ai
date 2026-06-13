from core.registry import get_connector


class ConnectorRouter:


    async def execute(
        self,
        connector,
        action,
        payload
    ):

        instance = get_connector(
            connector
        )


        if not instance:

            return {
                "error":
                "Connector missing"
            }


        return await instance.run(
            action,
            payload
        )


router=ConnectorRouter()
