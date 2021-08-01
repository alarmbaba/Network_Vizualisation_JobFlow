import os
import sqlite3 as sql1

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, "temp_db.db")

def search_suggestion_data_fetch(search_string):
    
    con = sql1.connect(db_path, check_same_thread=False)
    query = "select flow_name from Flows where upper(flow_name || ' ' || job_id) like '%" + str(search_string).upper() + "%' union select job_id from Flows where upper(flow_name || ' ' || job_id) like '%" + str(search_string).upper() + "%' limit 15;"
    
    with con:
        query_data = con.execute(query)
        
    query_list = [row for row in query_data]
    
    con.close()
    
    return query_list

def table_data_fetch(search_string):
    
    con = sql1.connect(db_path, check_same_thread=False)
    query = "select flow_name, job_id from flows where upper(flow_name || ' ' || job_id) like '%" + str(search_string).upper() + "%'"
    
    with con:
        query_data = con.execute(query)
        
    query_list = [row for row in query_data]
    
    con.close()
    
    return query_list

def graph_data_fetch(search_string):
    
    con = sql1.connect(db_path, check_same_thread=False)
    query = "select * from flow_all_v where upper(flow_name) = '" + str(search_string).upper() + "';"
    
    with con:
        query_data = con.execute(query)
        
    query_list = [row for row in query_data]
    
    con.close()
    
    return query_list