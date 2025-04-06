
import '../../../../data/models/mdlTenantRegister.dart';

abstract class TenantRegisterEvent {}

class SubmitTenantForm extends TenantRegisterEvent {
  final TenantRegisterModel model;

  SubmitTenantForm(this.model);
}
