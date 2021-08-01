from database.Query_Script import search_suggestion_data_fetch, table_data_fetch
import json


def search_result_list_return(search_string):
    
    search_result_list = [str(row[0]) for row in search_suggestion_data_fetch(search_string)]
    return search_result_list


def result_table_json_return(search_string):
    
    flow_table_data_list = table_data_fetch(search_string)
    flow_table_data_dict = []
    temp = {}
    
    for flow in flow_table_data_list:
        temp = {
            "flow_name" : flow[0],
            "job_id" : flow[1]
        }
        
        flow_table_data_dict.append(temp)
    
    return flow_table_data_dict 