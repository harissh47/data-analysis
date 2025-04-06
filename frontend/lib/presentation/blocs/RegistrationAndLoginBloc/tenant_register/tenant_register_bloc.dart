import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../data/repositories/tenant_repository.dart';
import 'tenant_register_event.dart';
import 'tenant_register_state.dart';


class TenantRegisterBloc extends Bloc<TenantRegisterEvent, TenantRegisterState> {
  final TenantRepository repository;

  TenantRegisterBloc(this.repository) : super(TenantInitial()) {
    on<SubmitTenantForm>((event, emit) async {
      emit(TenantLoading());
      try {
        final message = await repository.registerTenant(event.model);
        emit(TenantSuccess(message as String));
      } catch (e) {
        emit(TenantFailure(e.toString()));
      }
    });
  }
}
