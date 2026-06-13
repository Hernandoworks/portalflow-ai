from connectors.notion.client import NotionConnector
from connectors.github.client import GitHubConnector
from connectors.drive.client import DriveConnector


CONNECTORS = {

    "notion": NotionConnector(),

    "github": GitHubConnector(),

    "drive": DriveConnector()

}


def list_commands():

    output={}

    for name,connector in CONNECTORS.items():

        if hasattr(connector,"commands"):

            output[name]=connector.commands()

    return output



def action_exists(
    connector,
    action
):

    commands=list_commands()

    return (
        connector in commands
        and action in commands[connector]
    )



def get_connector(name):

    return CONNECTORS.get(name)
