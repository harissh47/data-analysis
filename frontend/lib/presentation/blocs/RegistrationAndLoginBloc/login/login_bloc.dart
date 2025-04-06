import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../data/repositories/login_repository.dart';
import 'login_event.dart';
import 'login_state.dart';

class LoginBloc extends Bloc<LoginEvent, LoginState> {
  
  final LoginRepository _loginRepository;

  LoginBloc(this._loginRepository) : super(LoginInitial()) {
    on<LoginUser>((event, emit) async {


      emit(LoginLoading());
      try {
        final data = await _loginRepository.login(event.user);
        emit(LoginSuccess(data['token'], data['user_id'],data['role']));

      } catch (e) {
        emit(LoginFailure(e.toString()));
        
      }
      
    });
  }
}
