
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../product_categoryjson/invoice_json.dart';

class InvoiceList extends StatefulWidget {
  const InvoiceList({super.key});

  @override
  State<InvoiceList> createState() => _InvoiceListState();
}

class _InvoiceListState extends State<InvoiceList> {


  List itemsTemp = [];
  int itemLength = 0;
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    setState(() {
      itemsTemp = invoice_json ;
      itemLength = invoice_json.length;
    });
  }


  download(){
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor:Colors.cyan.withOpacity(0.8),
          title: Row(
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              Image.network('https://www.yookatale.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo1.54d97587.png&w=384&q=75',height: 50,width: 50,)
            ],
          ),
          content: const Text('Downloading invoice',style:TextStyle(color:Colors.white),),
          actions: [

            MaterialButton(
              color: Colors.red,
              textColor: Colors.white,
              onPressed: () {

                Navigator.pop(context);
              },
              child: const Text('Cancel'),
            ),
          ],
        );
      },
    );

  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        title: const Text("Invoices",style:TextStyle(fontWeight: FontWeight.bold),),
        leading: InkWell(
          onTap: ()=> Navigator.of(context).pop(),
          child: const Icon(Icons.arrow_back_ios_new_outlined)),
      ),
      body:ListView.builder(
          itemCount:itemLength,
          itemBuilder:(context,index){

            return Container(
              color:Colors.white,
              child:Column(

                children: [

                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 5),
                    child: Card(
                      color: Colors.white,
                      elevation: 4,
                      margin: const EdgeInsets.only(left:5,right: 5,top: 3,bottom: 3),
                      child:ListTile(
                        horizontalTitleGap: 0,
                        onTap: (){

                          // Navigator.push(context,MaterialPageRoute(builder:(context)=>OrdersDetail(
                          //     id:itemsTemp[index]['orderid'],im:itemsTemp[index]['img'],nem:itemsTemp[index]['name'],quant:itemsTemp[index]['quant'],
                          //     price:itemsTemp[index]['price'],tot:itemsTemp[index]['total'],stat:itemsTemp[index]['status'],date:itemsTemp[index]['date'],
                          //     unit:itemsTemp[index]['unit']
                          // )));
                        },
                        leading:   CircleAvatar(
                          backgroundColor: Colors.white,
                          radius: 14,
                          child:Image.network('https://www.yookatale.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo1.54d97587.png&w=384&q=75',),
                        ),
                        title: Center(
                          child: Text(itemsTemp[index]['in'],style:  const TextStyle(fontSize: 14,
                              color:Colors.black,fontWeight: FontWeight.bold),),
                        ),
                       // subtitle: Text(itemsTemp[index]['date']),
                        trailing:InkWell(
                          onTap: (){
                            download();

                          },
                            child: const Icon(Icons.download,color:Colors.green,)
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
