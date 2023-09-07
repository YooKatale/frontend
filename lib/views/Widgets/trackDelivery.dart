// ignore_for_file: file_names
import 'package:firebase_database/firebase_database.dart';
import 'package:flutter/material.dart';
import 'package:order_tracker/order_tracker.dart';

Status? getStatus(String status) {
  switch(status.toLowerCase()) {
    case 'placed':
    return Status.order;
    case 'shipped':
    return Status.shipped;
    case 'outForDelivery':
    return Status.outOfDelivery;
    case 'delivered':
    return Status.delivered;
    default:
    return null;
  }
}
class TrackDelivery extends StatefulWidget {
  final String orderId;
  const TrackDelivery({Key? key, required this.orderId}) : super(key: key);

  @override
  State<TrackDelivery> createState() => _TrackDeliveryState();
}

class _TrackDeliveryState extends State<TrackDelivery> {
  final OrderStatusRepo orderStatusRepo = OrderStatusRepo();
  List<TextDto> orderList = [
    TextDto("Your order has been placed", "Fri, 25th August '22  - 10:47pm"),
    TextDto("Seller ha processed your order", "Sun, 27th August '22  - 10:19am"),
    TextDto("Your item has been picked up by courier partner.", "Tue, 29th Mar '22 - 5:00pm"),
  ];
  List<TextDto> shippedList = [
    TextDto("Your order has been shipped", "Tue, August '22  - 5:04pm"),
    TextDto("Your item has been received in the nearest hub to you.", null),
  ];
  List<TextDto> outOfDeliveryList = [
    TextDto("Your order is out for delivery", "Thu, August '22  - 2:27pm"),
  ];
  List<TextDto> deliveredList = [
    TextDto("Your order has been delivered", "Thu, 31th August '22 - 3:58pm"),
  ];
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Track Delivery'),
        backgroundColor: Colors.white,
        leading: InkWell(
          onTap: ()=> Navigator.of(context).pop(),
          child: const Icon(Icons.arrow_back_ios_new)),
      ),
      // body: Padding(
      //   padding: const EdgeInsets.symmetric(horizontal:25, vertical: 10),
      //   child: OrderTracker(
      //     status: Status.delivered,
      //     activeColor: Colors.green,
      //     inActiveColor: Colors.grey[300],
      //     orderTitleAndDateList: orderList,
      //     shippedTitleAndDateList: shippedList,
      //     outOfDeliveryTitleAndDateList: outOfDeliveryList,
      //     deliveredTitleAndDateList: deliveredList,
      //   ),
      // ),    
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 10),
        child: StreamBuilder<String>(
          stream: orderStatusRepo.getOrderStatusStream(widget.orderId),
          builder: (context, snapshot) {
            if (snapshot.hasData) {
              final currentStatus = snapshot.data!;
              return OrderTracker(
                // Passes the current status to the OrderTracker widget
                status: getStatus(currentStatus), // Default to "Placed"
                activeColor: Colors.green,
                inActiveColor: Colors.grey[300],
                // Passes other order stages lists
                orderTitleAndDateList: orderList,
                shippedTitleAndDateList: shippedList,
                outOfDeliveryTitleAndDateList: outOfDeliveryList,
                deliveredTitleAndDateList: deliveredList,
              );
            } else {
              // Handle loading or error state
              return const CircularProgressIndicator();
            }
          },
        ),
      ),
    );
  }
}

// handles firebase realtime databasse interactions
// 1. add rules to Realtime Daatabse to effect this
// 2. Save the aboce TextDtos to the database to retrive them
class OrderStatusRepo {
  final DatabaseReference databaseReference = FirebaseDatabase.instance.ref().child('orders');
  Stream<String> getOrderStatusStream(String orderId) {
    return databaseReference.child('orderId').child('status')
    .onValue.map((event) => event.snapshot.value.toString());
  }
  Future<void> updateOrderStatus(String orderId, String newStatus) {
    return databaseReference.child(orderId).child('status').set(newStatus);
  }
}