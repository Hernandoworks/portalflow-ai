import sys
import os

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

sys.path.insert(
    0,
    BASE_DIR
)
import yaml
from core.registry import list_commands


def generate_openapi():

    registry = list_commands()

    schema = {
        "openapi": "3.1.0",

        "info": {
            "title": "PortalFlow AI Action Gateway",
            "version": "0.1.0"
        },

        "servers": [
            {
                "url": "https://YOUR_DEPLOYED_API_URL"
            }
        ],

        "paths": {

            "/commands": {

                "get": {

                    "operationId":
                    "listCommands",

                    "description":
                    "List available PortalFlow actions",

                    "responses": {

                        "200": {
                            "description":
                            "Available commands"
                        }

                    }

                }

            },


            "/execute": {

                "post": {

                    "operationId":
                    "executeAction",

                    "description":
                    "Execute PortalFlow connector action",

                    "requestBody": {

                        "required": True,

                        "content": {

                            "application/json": {

                                "schema": {

                                    "type":"object",

                                    "properties": {

                                        "connector": {

                                            "type":"string",

                                            "enum":
                                            list(
                                                registry.keys()
                                            )

                                        },

                                        "action": {

                                            "type":"string"

                                        },

                                        "payload": {

                                            "type":"object"

                                        }

                                    },

                                    "required":[
                                        "connector",
                                        "action"
                                    ]

                                }

                            }

                        }

                    },


                    "responses": {

                        "200": {
                            "description":
                            "Execution result"
                        }

                    }

                }

            }

        }

    }


    with open(
        "../../schemas/openapi.yaml",
        "w"
    ) as f:

        yaml.dump(
            schema,
            f,
            sort_keys=False
        )


    print(
        "✅ Generated ../../schemas/openapi.yaml"
    )



if __name__ == "__main__":

    generate_openapi()

