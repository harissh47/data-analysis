

import 'package:frontend/data/models/mdlloginUser.dart';

abstract class LoginEvent {}

class LoginUser extends LoginEvent {
  final LoginModel user;

  LoginUser(this.user);
}
