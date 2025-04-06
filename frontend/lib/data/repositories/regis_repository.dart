import '../../domain/APIServices/register_service.dart';
import '../models/mdlUser.dart';


class RegisterRepository  {
  final RegisterService _registerRepository;

  RegisterRepository (this._registerRepository);

  Future<String> register(UserModel user) {
    return _registerRepository.register(user);
  }
}
