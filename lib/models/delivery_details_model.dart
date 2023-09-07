class DeliveryDetailsModel {
  String firstName;
  String lastName;
  String phoneNumber;
  String address;
  String email;
  String price;

  DeliveryDetailsModel ({
    required this.firstName,
    required this.address,
    required this.email,
    required this.lastName,
    required this.phoneNumber,
    required this.price
  });
  Map<String,dynamic> toJson() {
    return {
      'firstName': firstName,
      'lastName': lastName,
      'address': address,
      'email': email,
      'phoneNumber': phoneNumber,
      'price': price
    };
  }
}