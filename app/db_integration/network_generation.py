from database.Query_Script import graph_data_fetch
import json

class NetworkGeneration:

    def __init__(self, flow_name):
        self.flow_name = flow_name
        self.raw_data = graph_data_fetch(flow_name)
        self.network_json = {}
        self.job_list = []
        self.job_json = {}
        self.validation_downstream_list = []
        self.validation_json = {}
        self.downstream_json = {}
        self.environment_json = {}
        self.pdu_json = {}        
        self.children_list = []
        self.name = "name"
        
        
    def get_json_data(self):
        self.get_flow_details(self.raw_data[0])
        self.get_job_details(self.raw_data)
        self.get_evironment_details(self.raw_data[0])
        self.add_json_to_final()
        return json.dumps(self.network_json)
        
    def get_flow_details(self, data):
        self.network_json = {
            self.name : "flow",
            "flow_name" : data[20],
            "children" : ""
        }
    
    def get_job_details(self, data):
        for row in data:
            self.job_json = {
                self.name : row[0],                
                "job_name" : row[1],
                "source_job" : row[2],
                "target_job" : row[3],
                "frequency" : row[4],
                "job_source" : row[5],
                "job_target" : row[6],
                "how_to_link" : row[7],
                "children" : self.get_job_children(row)
            }
            self.job_list.append(self.job_json)
        
        self.job_json = {
            self.name : "jobs",
            "description" : "jobs associated",
            "children" : self.job_list
        }
        
    
    def get_job_children(self, data):
        self.validation_downstream_list = []
        self.validation_json = {}
        self.downstream_json = {}
        
        self.validation_json = {
            self.name : "validation",
            "validation_rule" : data[8],
            "validation_document_link" : data[9],
            "validation_suite_link" : data[10]
        }
        self.validation_downstream_list.append(self.validation_json)
        
        self.downstream_json = {
            self.name : "downstream",
            "downstream_system" : data[11],
            "downstream_details_link" : data[12],
            "downstream_knowledge_artefact" : data[13]
        }
        self.validation_downstream_list.append(self.downstream_json)
        
        return self.validation_downstream_list
    
    def get_evironment_details(self, data):        
        self.environment_json = {
            self.name : "environment",
            "environment_name" : data[14],
            "environment_details" : data[15]
        }
            
        self.pdu_json = {
            self.name : "pdu",
            "pdu_link" : data[16],
            "new_request_link" : data[17],
            "new_request_sample" : data[18]
        }
            
    def add_json_to_final(self):
        self.children_list.append(self.job_json)
        self.children_list.append(self.environment_json)
        self.children_list.append(self.pdu_json)
        
        self.network_json["children"] = self.children_list  
