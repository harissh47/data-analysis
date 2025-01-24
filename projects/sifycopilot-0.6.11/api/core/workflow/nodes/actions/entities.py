
from pydantic import BaseModel

from core.workflow.entities.base_node_data_entities import BaseNodeData


class FormConfig(BaseModel):
    """
    Form Config.
    """
    id: str
    name: str
    datatype: str


class ActionsNodeData(BaseNodeData):
    """
    Actions Node Data.
    """
    action_type: str
    form_values: list[FormConfig] = None
    custom_forms: str = None
    action_mandatory: bool = False
    memory: bool = False