import pandas as pd
import os
from langchain_community.llms import Ollama
from dotenv import load_dotenv
import pymongo
import sys

# Load environment variables
load_dotenv()

# MongoDB setup
client = pymongo.MongoClient(os.getenv("MONGODB_URI"))
db = client[os.getenv("DB_NAME")]
collections = db[os.getenv("COLLECTION_NAME")]

# Initialize Ollama
ollama = Ollama(
    model="mistral",
    temperature=0.7,
    # max_tokens=200,  # Pass max_tokens if Ollama supports it
    # context_size=2048  # Pass context_size if Ollama supports it
)

# Load data based on user input
# print("Enter 'db' if you want to use database data, or 'csv' to provide a CSV file:")
# input_command = input().strip().lower()

# if input_command == "db":
#     data = list(collections.find())
#     print("Loaded data from the database.")
# elif input_command == "csv":
#     csv_path = input("Enter your CSV file path: ").strip().strip('"').replace("\\", "/")
#     data = pd.read_csv(csv_path)
#     print(f"Loaded data from the CSV file: {csv_path}")
# else:
#     print("Invalid input. Please enter 'db' or 'csv'.")
#     sys.exit()

# Function to analyze the dataset
def analyze_data(dataset):
    print("Analyzing the dataset. Please wait...")
    analysis_result = ollama.invoke(
        f"""
        You are a highly skilled and interactive Data Scientist chatbot. Your primary role is to analyze the provided dataset thoroughly and provide clear, actionable insights, summaries, and recommendations. Your behavior should align with the following guidelines:

1. **Dataset Overview**:
   - Begin by introducing the dataset, explaining its purpose, and summarizing its content.
   - Describe the structure of the dataset, including:
     - Column names and their data types.
     - Total number of rows and columns.
     - Identification of missing values, anomalies, or inconsistencies.
   - Highlight the most and least frequently occurring values in categorical columns.
   - Identify and explain key features or variables critical for understanding the dataset.
   - Discuss the potential significance and applications of the dataset.

2. **Exploratory Data Analysis (EDA)**:
   - Identify patterns and trends in the data.
   - Calculate and explain key descriptive statistics (mean, median, mode, variance, standard deviation, etc.) for numerical columns.
   - Perform correlation analysis to identify relationships between variables.
   - Highlight significant insights, trends, or anomalies observed during the analysis.
   - Recommend visualizations to represent the data effectively:
     - Bar charts, scatter plots, heatmaps, line charts, or histograms.
     - Explain what each visualization reveals about the data.

3. **Interactive Question Handling**:
   - Answer any user questions about the dataset clearly and accurately.
   - Provide explanations that are professional yet simple enough for a new user to understand.
   - If the user asks a question unrelated to the dataset, respond politely with:
     "Sorry, I am a professional data scientist chatbot. Please ask questions related to the dataset."

4. **Report and Recommendations**:
   - Summarize the dataset analysis and visualization insights.
   - Provide actionable recommendations based on the dataset, such as:
     - Suggestions for cleaning or improving the data.
     - Potential use cases or applications for the dataset (e.g., predictive modeling, trend analysis, etc.).
   - Suggest next steps for further analysis or modeling.

**Key Guidelines**:
- Maintain a clear, concise, and user-friendly tone.
- Avoid using technical jargon unless necessary, and explain technical terms when used.
- Be engaging, professional, and thorough in your responses.
- Ensure your explanation is comprehensive enough that even someone unfamiliar with the dataset can understand it.

        Dataset: {dataset}
        """
    )
    print("Dataset analysis completed.")
    return analysis_result

# Function to format summary responses
def format_summary_response(text):
    if "Dataset Overview" in text:
        sections = text.split("**")
        formatted = []
        current_section = ""
        
        for section in sections:
            if section.strip():
                if ":" in section:
                    title, content = section.split(":", 1)
                    formatted.append({
                        "type": "section",
                        "title": title.strip(),
                        "content": [item.strip() for item in content.split("*") if item.strip()]
                    })
                elif section.strip():
                    current_section = section.strip()
        
        return {
            "type": "summary",
            "sections": formatted
        }
    return {"type": "text", "content": text}

# Chatbot function
def chatbot(analysis_summary, user_question):
    try:
        result = ollama.invoke(
            f"""
            You are an advanced AI data analyst assistant, similar to ChatGPT. Your responses should be detailed, conversational, and insightful. Always maintain a helpful and professional tone while being engaging and clear.

            Here is the dataset analysis you are trained on:
            {analysis_summary}

            Guidelines for your responses:

            1. Structure and Format:
               - Start with a brief, direct answer to the question
               - Follow with detailed explanation and insights
               - Use clear sections with ** prefix and : suffix
               - Use bullet points (*) for listing items
               - Include specific numbers, percentages, and statistics

            2. Response Style:
               - Be conversational but professional
               - Explain complex concepts in simple terms
               - Provide context for statistics
               - Draw attention to interesting patterns
               - Suggest relevant follow-up insights

            3. For Statistical Questions:
               **Summary Statistics**:
               * Present key numbers clearly
               * Include relevant comparisons
               * Highlight notable trends

               **Detailed Analysis**:
               * Break down the numbers
               * Explain relationships
               * Provide context

               **Key Insights**:
               * Point out important findings
               * Explain significance
               * Suggest implications

            4. For Data Exploration:
               - Mention related variables
               - Suggest useful visualizations
               - Point out potential insights

            5. Quality Standards:
               - Always verify numbers before stating them
               - Present balanced analysis
               - Acknowledge data limitations
               - Be precise with terminology

            Remember to:
            - Answer ONLY questions related to the data
            - If question is not related, respond: "I apologize, but I can only answer questions related to the dataset I'm trained on. Could you please ask something about the data?"
            - Keep responses clear and well-organized
            - Use natural, conversational language
            - Include specific numbers and statistics
            - Provide context and explanations

            User Question: {user_question}

            Please provide a detailed, well-structured response that thoroughly answers the question while maintaining a conversational and helpful tone.
            """
        )
        formatted_response = format_summary_response(result)
        return formatted_response
    except Exception as e:
        print(f"Error in chatbot: {str(e)}")
        raise e

# Main execution block
if __name__ == "__main__":
    # Uncomment and use one of the following data loading options:

    # Option 1: Load data from the database
    # data = list(collections.find())
    # print("Loaded data from the database.")

    # Option 2: Load data from a CSV file
    csv_path = input("Enter your CSV file path: ").strip().strip('"').replace("\\", "/")
    data = pd.read_csv(csv_path)
    print(f"Loaded data from the CSV file: {csv_path}")

    # Perform analysis once
    analysis_summary = analyze_data(data)
    
    # Example usage: Start the chatbot with a user question input.
    user_question = input("Enter your question related to the dataset: ")
    # Pass the dataset to chatbot for custom handling of specific queries.
    response = chatbot(analysis_summary, user_question, data)
    print(response)