from langchain.utilities.tavily_search import TavilySearchAPIWrapper
from langchain.agents import initialize_agent, AgentType
from langchain.tools.tavily_search import TavilySearchResults
from langchain_openai import ChatOpenAI
import os
import boto3
import json
from typing import List
from langchain_core.agents import AgentActionMessageLog, AgentFinish
from langchain_core.pydantic_v1 import BaseModel, Field

class Response(BaseModel):
    """Final response to the question being asked"""
    answer: str = Field(description="The final answer to respond to the user")

def get_secrets(name):
    ssm = boto3.client('ssm', region_name='ap-southeast-1')  # replace 'us-west-2' with your AWS region
    parameter = ssm.get_parameter(Name=name, WithDecryption=True)
    return parameter['Parameter']['Value']


def lambda_handler(event, context):
    print(event)
    body = json.loads(event["body"])

    query = body["message"]
    
    os.environ["TAVILY_API_KEY"] = get_secrets("dev-jolteon-TAVILY_API_KEY")
    os.environ["OPENAI_API_KEY"] = get_secrets("dev-jolteon-OPENAI_API_KEY")

    chat = ChatOpenAI(
        model="gpt-3.5-turbo-1106",
        api_key=os.getenv("OPENAI_API_KEY"),
    )

    chat = chat.bind_functions([Response])
    search = TavilySearchAPIWrapper()
    tavily_tool = TavilySearchResults(
        api_wrapper=search,
        include_domains=["gov.sg", "edu.sg", ".sg"],
        exclude_domains=[
            "usda.gov", 
            "gov.uk", 
            "gov.au",
        ],

    )
    
    agent_chain = initialize_agent(
        [tavily_tool],
        chat,
        agent=AgentType.STRUCTURED_CHAT_ZERO_SHOT_REACT_DESCRIPTION,
        verbose=False
    )

    bot_response = agent_chain.invoke(query, return_only_outputs=True)

    # parse the response
    bot_response = json.loads(bot_response)
    bot_response = bot_response["answer"]


    

    return {
        "statusCode": 200,
        "body": json.dumps(bot_response)
    }