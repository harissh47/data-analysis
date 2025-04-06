class TenantRegisterModel {
  final int userId;
  final int apartmentId;
  final String address;
  final String city;
  final String state;
  final String zipCode;
  final String country;
  final String tenantType;
  final String tenantStatus;
  final String tenantStartDate;
  final String tenantEndDate;
  final String familyMembers;
  final int numberOfMembers;

  TenantRegisterModel({
    required this.userId,
    required this.apartmentId,
    required this.address,
    required this.city,
    required this.state,
    required this.zipCode,
    required this.country,
    required this.tenantType,
    required this.tenantStatus,
    required this.tenantStartDate,
    required this.tenantEndDate,
    required this.familyMembers,
    required this.numberOfMembers,
  });

  Map<String, dynamic> toJson() => {
    "user_id": userId,
    "apartment_id": apartmentId,
    "address": address,
    "city": city,
    "state": state,
    "zip_code": zipCode,
    "country": country,
    "tenant_type": tenantType,
    "tenant_status": tenantStatus,
    "tenant_start_date": tenantStartDate,
    "tenant_end_date": tenantEndDate,
    "family_members": familyMembers,
    "number_of_members": numberOfMembers,
  };
}
