from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_community.document_loaders import WebBaseLoader
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.documents import Document
from langchain.chains import create_retrieval_chain
from langchain.chains import create_history_aware_retriever
from langchain_core.messages import HumanMessage, AIMessage
from langchain.memory import ChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain.utilities.tavily_search import TavilySearchAPIWrapper
from langchain.agents import initialize_agent, AgentType
from langchain.tools.tavily_search import TavilySearchResults
import os

# Define Constants
output_parser = StrOutputParser()
chat = ChatOpenAI(
    model="gpt-3.5-turbo-1106",
    api_key=os.getenv("OPENAI_API_KEY"),
)
embeddings = OpenAIEmbeddings()
text_splitter = RecursiveCharacterTextSplitter()


def web_content_query(input, link ):
    loader = WebBaseLoader(link)
    docs = loader.load()
    # split the documents
    docs = text_splitter.split_documents(docs)
    # vectorise the documents
    vector = FAISS.from_documents(docs, embeddings)
    retriever = vector.as_retriever()

    prompt = ChatPromptTemplate.from_messages(
        [

            (
                "system",
                """
                    <CONTEXT>
                    {context}
                    The user is a business owner seeking information about government schemes and grants relevant to their business.
                    <END-OF-CONTEXT>

                    <OBJECTIVE>
                    Search and Retrieve information on available government schemes and grants for Singapore. 
                    For each, provide a summary and include the official source link. 
                    Reference to the chat history is allowed.
                    If you do not understand the question, please ask for clarification.
                    <END-OF-OBJECTIVE>

                    <STYLE>
                    Formal and professional, like a government directory or guide.
                    <END-OF-STYLE>

                    <TONE>
                    Informative and neutral.
                    <END-OF-TONE>

                    <AUDIENCE>
                    Business owners who may not be experts in navigating government resources.
                    <END-OF-AUDIENCE>
                    
                    <PROMPT>
                    Answer the User's question about government schemes and grants based on the provided context.
                    <END-OF-PROMPT>

                    

                """

            ),
            MessagesPlaceholder(variable_name="chat_history"),
            ("user", "{input}")
        ]
    )

    chain = prompt | chat

    document_chain = create_stuff_documents_chain(chat, prompt)

    ephemeral_history = ChatMessageHistory()
    chain_with_history = RunnableWithMessageHistory(
        chain,
        lambda session_id: ephemeral_history,
        input_messages_key="input",
        history_messages_key="chat_history"
    )

    response = chain_with_history.invoke(
        {"input": input, "context": "The user is a business owner seeking information about government schemes and grants relevant to their business."},
        {"configurable": {"session_id": "4fae9861-be45-4b7b-9977-2ab15c842fd2"}}
    )
    

    return response


# print(web_content_query("What is the Enterprise Development Grant?", "https://www.enterprisesg.gov.sg/financial-support/enterprise-development-grant"))



def tavilySearchAgent(query):
    
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

