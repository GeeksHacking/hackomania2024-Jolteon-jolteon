from langchain_community.llms import HuggingFaceEndpoint
from langchain_community.document_loaders import WebBaseLoader
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain_community.document_loaders import WebBaseLoader
from langchain_community.document_loaders import TextLoader
from langchain_community.embeddings.sentence_transformer import (
    SentenceTransformerEmbeddings,
)
from langchain_community.vectorstores import Chroma
from langchain_text_splitters import CharacterTextSplitter
from langchain import hub
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain.chains import RetrievalQA

from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain


import os

# define model repo id
model_repo_id = "google/gemma-2b-it"
os.environ["HUGGINGFACEHUB_API_TOKEN"] = "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"
TAVILY_API_KEY = "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"

# setup huggingface endpoint
llm = HuggingFaceEndpoint(
    repo_id=model_repo_id, 
    max_length=2048, 
    temperature=0.1
)

DEFAULT_PROMPT_TEMPLATE = """
    <CONTEXT>
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

    <EXAMPLE_RESPONSE>
    {
        "results": [
            {
                "scheme_name": "Name of the scheme",
                "description": "A concise summary of the scheme",
                "source_url": "Official government link to the scheme details"
            },
            { 
                /* ...  More schemes listed in the same format */
            }
        ] 
    }
    <END-OF-EXAMPLE_RESPONSE>

    <CHAT-HISTORY>
    {chat_history}
    <END-OF-CHAT-HISTORY>

    <FOLLOW-UP-INPUT>
    {question}
    <END-OF-FOLLOW-UP-INPUT>

    <RESPONSE>
    {response}
    <END-OF-RESPONSE>

"""




def website_to_vector(link):
    # load webpage
    loader = WebBaseLoader(link)
    data = loader.load()
    # split it into chunks
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
    docs = text_splitter.split_documents(data)

    # create the open-source embedding function
    embedding_function = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")

    # load it into Chroma
    db = Chroma.from_documents(docs, embedding_function)
    return db


answer_db = website_to_vector("https://www.enterprisesg.gov.sg/financial-support/enterprise-development-grant")

retriever = answer_db.as_retriever(
    search_type="mmr",
    search_kwargs={
        'k': 4, 
        'fetch_k': 20
    },
)

prompt = hub.pull("rlm/rag-prompt")

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

# rag_chain = (
#     {"context": retriever | format_docs, "question": RunnablePassthrough()}
#     | prompt
#     | llm
# )

# Create a conversation buffer memory
memory = ConversationBufferMemory(memory_key='chat_history', return_messages=True)

prompt = PromptTemplate.from_template(DEFAULT_PROMPT_TEMPLATE)

conversational_chain = ConversationalRetrievalChain.from_llm(
    llm=llm,
    chain_type="stuff",
    retriever=answer_db.as_retriever(),
    memory=memory,
    condense_question_prompt=prompt
)



def conversational_chain_fn(question):
    return conversational_chain({
        "question": question
    })

