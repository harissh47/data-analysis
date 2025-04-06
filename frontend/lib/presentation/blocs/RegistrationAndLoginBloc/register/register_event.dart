import '../../../../data/models/mdlUser.dart';

abstract class RegisterEvent {}

class RegisterUser extends RegisterEvent {
  final UserModel user;

  RegisterUser(this.user);
}
