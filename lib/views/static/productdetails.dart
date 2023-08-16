
import 'dart:async';

import 'package:flutter/material.dart';

class ProductDetails extends StatefulWidget {
  final String im;
  final String nem;
  final String price;
  final String cross;
  final String unit;
  final String wei;


  const ProductDetails({super.key, required this.im, required this.nem, required this.price, required this.cross, required this.unit, required this.wei});

  @override
  State<ProductDetails> createState() => _ProductDetailsState();
}

class _ProductDetailsState extends State<ProductDetails> {


  bool _loading=true;
  @override
  void initState() {

   // late List photos;

    Timer(const Duration(seconds: 2),(){

      setState(() {
        _loading=false;
      });

    });
    super.initState();
  }



  cart(){
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
          content: const Text('Saved to cart',style:TextStyle(color:Colors.white),),
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

  save(){
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
          content: const Text('Saved for later',style:TextStyle(color:Colors.white),),
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

      var offer = (double.parse(widget.cross) - double.parse(widget.price)) /
          double.parse(widget.cross) * 100;


    return Scaffold(
      backgroundColor: Colors.grey[10],
      appBar: AppBar(
        backgroundColor: Colors.lightGreen,
        title:Text(widget.nem,style: const TextStyle(fontWeight: FontWeight.bold,color: Colors.white),),
        actions: [
          IconButton(onPressed: (){

            save();
          },
              icon:const Icon(Icons.favorite_outlined,color: Colors.red,))
        ],
      ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(4.0),
        child: Container(
          child:Row(
            children: [

              Expanded(
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.green,
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: MaterialButton(
                    onPressed:(){

                      cart();
                    },
                    child:const Text('Add to cart',style: TextStyle(fontSize: 18,color: Colors.white),),
                  ),
                ),
              ),

              const SizedBox(width: 10,),

              Expanded(
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.black54,
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: MaterialButton(
                    onPressed:(){

                      save();
                    },
                    child:const Text('Save for Later',style: TextStyle(fontSize: 18,color: Colors.white),),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
      body: ListView(
        padding:const EdgeInsets.only(top: 8,left: 10,right: 10),
        children: [

          Container(
            height: 200,
            decoration: BoxDecoration(
              color: Colors.grey.shade100,
              borderRadius: BorderRadius.circular(4),
            ),
            width: MediaQuery.of(context).size.width,
            child: _loading ? Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [

                  CircularProgressIndicator(
                    valueColor: AlwaysStoppedAnimation<Color>(Theme.of(context).primaryColor),
                  ),
                  const SizedBox(height:10,),
                  const Text('Loading you Image..'),

                ],
              ),
            ): Image.network(widget.im),
          ),
          const SizedBox(height: 10,),

          const Divider(color: Colors.grey,),
          Container(
            decoration: BoxDecoration(
              color: Colors.grey.shade100,
              borderRadius: BorderRadius.circular(4),
            ),
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.start,
                children: [

                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(widget.nem.toUpperCase(),style: const TextStyle(fontWeight: FontWeight.bold,fontSize: 20),),

                      widget.cross == null ? const Text(''):Text("${offer.toStringAsFixed(0)} % OFF",style: const TextStyle(color: Colors.green,fontWeight: FontWeight.bold,fontSize: 18),),
                    ],
                  ),

                  const SizedBox(height: 4,),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Weight',style: TextStyle(fontSize: 15,color: Colors.black),),

                      Text(widget.wei,style: const TextStyle(fontSize: 15),),

                    ],),
                  const SizedBox(height: 4,),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Unit',style: TextStyle(fontSize: 15,color: Colors.black),),

                      Text(widget.unit,style: const TextStyle(fontSize: 15),),

                    ],),

                  const SizedBox(height: 4,),


                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                     widget.cross == null ? const Text(''):Row(
                        children: [
                          const Text('Original Price:'),
                          const SizedBox(width: 4,),
                          Text('\$ ${widget.cross}',style: const TextStyle(fontSize: 15,color: Colors.black,decoration: TextDecoration.lineThrough),),
                        ],
                      ),

                      Row(
                        children: [
                          const Text('Current Price:'),
                          const SizedBox(width: 4,),
                          Text('\$ ${widget.price}',style: const TextStyle(fontSize: 18,color: Colors.green),),
                        ],
                      ),

                  ],),

                  const SizedBox(height: 4,),

              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [


                  IconButton(
                      icon: const Icon(
                        Icons.add_circle,
                        color: Colors.green,
                      ),
                      onPressed: () {
                        //shop.updateQuanity(catid:pros[index].id, quant: 'adding',context: context);
                      }),


                  const Text(
                    '1', style: TextStyle(
                      color: Colors.black),),


                  IconButton(
                      icon: const Icon(
                        Icons.remove_circle,
                        color: Colors.red,
                      ),
                      onPressed: () {
                        // shop.updateQuanity( catid:pros[index].id, quant: 'sub',context:context);

                      }),


                ],
              ),

                ],
              ),
            ),
          )
        ],
      ),
    );
  }
}
