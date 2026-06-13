import os
from dotenv import load_dotenv
from github import Github

load_dotenv()


class GitHubConnector:


    def __init__(self):

        self.client = Github(
            os.getenv("GITHUB_TOKEN")
        )


    def commands(self):

        return {

            "repo.list":{},
            "repo.create":{},

            "file.read":{},
            "file.create":{},
            "file.update":{},

            "issue.create":{},
            "issue.update":{},

            "branch.create":{},

            "pr.create":{}

        }


    async def run(
        self,
        action,
        payload
    ):

        if action=="repo.list":

            return [
                r.full_name
                for r in
                self.client.get_user().get_repos()
            ]


        return {
            "status":"registered",
            "action":action
        }
