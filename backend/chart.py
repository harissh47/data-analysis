from ai import sql_generator
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import flask
import plotly.io as pio
# app=flask(__name__)
def chart():
   
    result=sql_generator()
    for query in result:
        print(query)
    # print(result)
    # print(result)
if __name__ == "__main__":
    chart()
