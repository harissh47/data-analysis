import json
from typing import cast, Any

from core.workflow.nodes.base_node import BaseNodeData, BaseNode
from core.workflow.entities.node_entities import NodeRunResult, NodeType, SystemVariable
from core.workflow.entities.variable_pool import VariablePool
from core.workflow.nodes.actions.entities import ActionsNodeData
from models.workflow import WorkflowNodeExecutionStatus
from extensions.ext_database import db
from models.model import FormMemory


class ActionsNode(BaseNode):
    _node_data_cls = ActionsNodeData
    node_type = NodeType.ACTIONS
    
    def _run(self, variable_pool: VariablePool) -> NodeRunResult:
        """
        Run node
        :param variable_pool: variable pool
        :return:
        """
        node_data = self.node_data
        node_data = cast(self._node_data_cls, node_data)

        try:
            form_values = []
            custom_forms = ''
            action_mandatory = node_data.action_mandatory
            memory = node_data.memory
            
            if node_data.action_type == 'Form' and node_data.form_values != None:
                for val in node_data.form_values:
                    form_value = {
                        'id': val.id,
                        'name': val.name,
                        'datatype': val.datatype,
                    }
                    
                    form_values.append(form_value)
            
            if node_data.action_type == 'Custom Form' and node_data.custom_forms != None:
                custom_forms = node_data.custom_forms
                    
            
            return NodeRunResult(
                status=WorkflowNodeExecutionStatus.SUCCEEDED,
                outputs={
                    "action_type": node_data.action_type,
                    "form_values": form_values,
                    "custom_forms": custom_forms,
                    "action_mandatory": action_mandatory,
                    "memory": memory,
                }
            )
        except Exception as e:
            return NodeRunResult(
                status=WorkflowNodeExecutionStatus.FAILED,
                error=str(e)
            )
    
    @classmethod
    def _extract_variable_selector_to_variable_mapping(cls, node_data: BaseNodeData) -> dict[str, list[str]]:
        """
        Extract variable selector to variable mapping
        :param node_data: node data
        :return:
        """
        return {}
    
    def _fetch_memory(self, memory: bool,
                      variable_pool: VariablePool) -> dict[str, Any]:
        """
        Fetch Memory
        """
        if not memory:
            return None
       
        # get conversation id
        conversation_id = variable_pool.get_variable_value(['sys', SystemVariable.CONVERSATION_ID.value])
        if conversation_id is None:
            return None
        
        # get memory if exists
        form_memory = db.session.query(FormMemory).filter(
            FormMemory.conversation_id == conversation_id
        ).first()
        
        if not form_memory:
            return None
        
        return form_memory
    
    @classmethod
    def create_memory(self, args: Any):
        """
        Create a 
        """
        if not args.get('conversation_id'):
            raise ValueError('Conversation Id is required')
        
        conversation_id = args['conversation_id']

        if not args.get('app_id'):
            raise ValueError('App Id is required')
        
        app_id = args['app_id']
        
        if not args.get('form_value'):
            raise ValueError('Form Values are required')
        
        form_value = args['form_value']
        
        show_input = args.get('show_input', False)
        
        try:
            form_memory = FormMemory(
                conversation_id=conversation_id,
                app_id=app_id,
                form_value=form_value,
                show_input=show_input
            )
            
            db.session.add(form_memory)
            db.session.commit()

            return {
                "result": "success"
            }
        except Exception as e:
            raise e