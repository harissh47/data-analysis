abstract class TenantRegisterState {}

class TenantInitial extends TenantRegisterState {}

class TenantLoading extends TenantRegisterState {}

class TenantSuccess extends TenantRegisterState {
  final String message;

  TenantSuccess(this.message);
}

class TenantFailure extends TenantRegisterState {
  final String error;

  TenantFailure(this.error);
}
