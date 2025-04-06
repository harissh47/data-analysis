import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../data/repositories/regis_repository.dart';
import 'register_event.dart';
import 'register_state.dart';

class RegisterBloc extends Bloc<RegisterEvent, RegisterState> {
  final RegisterRepository _registerRepository;

  RegisterBloc(this._registerRepository) : super(RegisterInitial()) {
    on<RegisterUser>((event, emit) async {
      emit(RegisterLoading());
      try {
        final message = await _registerRepository.register(event.user);
        emit(RegisterSuccess(message));
      } catch (e) {
        emit(RegisterFailure(e.toString()));
      }
    });
  }
}
