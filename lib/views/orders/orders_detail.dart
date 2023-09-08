import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

class OrdersDetail extends StatefulWidget {

  final String id;
  final String im;
  final String nem;
  final String quant;
  final String price;
  final String tot;
  final String stat;
  final String date;
  final String unit;

  const OrdersDetail({super.key, required this.id, required this.im, required this.nem, required this.quant, required this.price, required this.tot, required this.stat, required this.date, required this.unit, });

  @override
  State<OrdersDetail> createState() => _OrdersDetailState();
}

class _OrdersDetailState extends State<OrdersDetail> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        // backgroundColor: Colors.lightGreen,
        title: const Text("Orders Details",style:TextStyle(fontWeight: FontWeight.bold),),
        leading: InkWell(
          onTap: ()=> Navigator.of(context).pop(),
          child: const Icon(Icons.arrow_back_ios_new_outlined)),
      ),
      body:ListTile(
        leading:Container(
          decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(10)
          ),
          child: CachedNetworkImage(
            imageUrl:widget.im,
          ) ,
        ),
        title: Text(widget.nem),
        subtitle: Text('quantity: ${widget.quant}'),
        trailing:Text('Shs:${widget.price}'),
      ) ,
    );
  }
}
