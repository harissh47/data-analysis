import logging

from flask_restful import reqparse
from werkzeug.exceptions import InternalServerError

from controllers.web import api
from controllers.web.wraps import WebApiResource
from core.workflow.nodes.actions.actions_node import ActionsNode

logger = logging.getLogger(__name__)


class ActionMemoryApi(WebApiResource):
    def post(self, app_model, end_user):
        """
        Create Form Memory
        """
        parser = reqparse.RequestParser()
        parser.add_argument('app_id', type=str, required=True, location='json')
        parser.add_argument('conversation_id', type=str, required=True, location='json')
        parser.add_argument('form_value', type=dict, required=True, location='json')
        args = parser.parse_args()
        
        try:
            res = ActionsNode.create_memory(
                args=args
            )
            
            return res
        except ValueError as e:
            raise e
        except Exception as e:
            print(e)
            logging.exception("internal server error.")
            raise InternalServerError()


api.add_resource(ActionMemoryApi, '/action-memory')