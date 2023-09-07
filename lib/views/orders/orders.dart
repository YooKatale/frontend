
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../product_categoryjson/orders.dart';
import 'orders_detail.dart';

class Orders extends StatefulWidget {
  const Orders({super.key});

  @override
  State<Orders> createState() => _OrdersState();
}

class _OrdersState extends State<Orders> {

  List itemsTemp = [];
  int itemLength = 0;
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    setState(() {
      itemsTemp = orders_json ;
      itemLength = orders_json.length;
    });
  }



  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor:Colors.white ,
      appBar: AppBar(
        backgroundColor: Colors.white,
        leading: InkWell(
          onTap: ()=> Navigator.of(context).pop(),
          child: const Icon(Icons.arrow_back_ios_new_outlined)),
        title: const Text("Orders",style:TextStyle(color: Colors.black),),
      ),
      
      body:ListView.builder(
          itemCount:itemLength,
          itemBuilder:(context,index){
            return Container(
              color:Colors.white,
              child:Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.only(left:6.0, right: 6),
                    child: Card(
                      elevation: 4,
                      color: const Color(0xffffffff),
                      margin: const EdgeInsets.only(left:5,right: 5,top: 5,bottom: 5),
                      child:ListTile(
                        horizontalTitleGap: 0,
                        onTap: (){
                          Navigator.push(context,MaterialPageRoute(builder:(context)=>OrdersDetail(
                              id:itemsTemp[index]['orderid'],im:itemsTemp[index]['img'],nem:itemsTemp[index]['name'],quant:itemsTemp[index]['quant'],
                            price:itemsTemp[index]['price'],tot:itemsTemp[index]['total'],stat:itemsTemp[index]['status'],date:itemsTemp[index]['date'],
                            unit:itemsTemp[index]['unit']
                          )));
                        },
                        leading:   CircleAvatar(
                          backgroundColor: Colors.lime.shade100,
                          radius: 14,
                          child: Icon(CupertinoIcons.square_list,size: 18,
                            color: itemsTemp[index]['status'] =='Rejected' ? Colors.red:
                            itemsTemp[index]['status'] =='Pending' ? Colors.grey:
                            itemsTemp[index]['status'] =='canceled' ? Colors.orange[700]:
                            itemsTemp[index]['status']=='completed' ? Colors.green[400]:Colors.orange,
                          ),
                        ),
                        title: Text(itemsTemp[index]['status'],style:  TextStyle(fontSize: 12,
                            color: itemsTemp[index]['status'] =='Rejected' ? Colors.red:
                            itemsTemp[index]['status'] =='Pending' ? Colors.grey:
                            itemsTemp[index]['status'] =='canceled' ? Colors.orange[700]:
                            itemsTemp[index]['status']=='completed' ? Colors.green[400]:Colors.orange
                            ,fontWeight: FontWeight.bold),),
                        subtitle: Text(itemsTemp[index]['date']),
                        trailing: Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text('Order ID:${itemsTemp[index]['orderid']}',style: const TextStyle(fontSize: 12,fontWeight: FontWeight.bold),),
                            const Text('Payment Type:Cash on Delivery',style: TextStyle(fontSize: 12,fontWeight: FontWeight.bold),),
                            Text('Amount:Shs${itemsTemp[index]['total']}',style: const TextStyle(fontSize: 12,fontWeight: FontWeight.bold),),
                          ],
                        ),

                      ),
                    ),
                  ),

                  //const Divider(height: 3,color: Colors.grey,),
                ],
              ) ,
            );
          }
      ),
    );
  }
}
