import '../../domain/APIServices/login_service.dart';
import '../models/mdlloginUser.dart';


class LoginRepository {
  final LoginService _loginService;

  LoginRepository(this._loginService);

  Future<Map<String, dynamic>> login(LoginModel user) {
    return _loginService.login(user);
  }
}
