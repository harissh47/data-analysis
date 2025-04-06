abstract class LoginState {}

class LoginInitial extends LoginState {}

class LoginLoading extends LoginState {}

class LoginSuccess extends LoginState {
 
  final String token;
  final int userId;
  final String role;

  LoginSuccess(this.token, this.userId,this.role);
}

class LoginFailure extends LoginState {
  final String error;

  LoginFailure(this.error);
}
