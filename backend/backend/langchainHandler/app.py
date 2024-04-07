from langchain.utilities.tavily_search import TavilySearchAPIWrapper
from langchain.agents import initialize_agent, AgentType
from langchain.tools.tavily_search import TavilySearchResults
from langchain_openai import ChatOpenAI
import os

def mainHandler(event, context):

    query = event.query
    openai_key = event.openai_key
    os.environ["TAVILY_API_KEY"] = event.tavily_key
    os.environ["OPENAI_API_KEY"] = event.openai_key

    chat = ChatOpenAI(
        model="gpt-3.5-turbo-1106",
        api_key=os.getenv("OPENAI_API_KEY"),
    )
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
        verbose=True
    )

    return agent_chain.run(query)