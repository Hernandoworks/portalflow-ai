import os
from dotenv import load_dotenv
from notion_client import Client

load_dotenv()


class NotionConnector:

    def __init__(self):
        self.client = Client(
            auth=os.getenv("NOTION_TOKEN")
        )


    def commands(self):
        return {

            "search.all": {
                "risk":"safe",
                "description":"Search Notion workspace"
            },

            "page.create": {
                "risk":"write",
                "description":"Create Notion page"
            },

            "page.retrieve": {
                "risk":"safe",
                "description":"Retrieve page"
            },

            "page.update": {
                "risk":"write",
                "description":"Update page"
            },

            "database.query": {
                "risk":"safe",
                "description":"Query database"
            },

            "block.append": {
                "risk":"write",
                "description":"Append blocks"
            }

        }


    async def run(self, action, payload):

        if action == "search.all":
            return self.client.search(
                query=payload.get("query","")
            )


        return {
            "status":"registered",
            "action":action
        }
