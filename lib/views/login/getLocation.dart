import 'dart:async';

import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:yookatale/gradient/dashboard.dart';

class GetLocationScreen extends StatefulWidget {
  static const  String id='getLocation';
  GetLocationScreen({Key? key}) : super(key: key);

  @override
  State<GetLocationScreen> createState() => _GetLocationScreenState();
}

class _GetLocationScreenState extends State<GetLocationScreen> {

  TextEditingController zoneTextController = TextEditingController();
  TextEditingController areaTextController = TextEditingController();
  final Completer<GoogleMapController> _controllerGoogleMap =
      Completer<GoogleMapController>();
    late GoogleMapController newGoogleMapController;
   static const CameraPosition _kGooglePlex = CameraPosition(
    target: LatLng(37.42796133580664, -122.085749655962),
    zoom: 14.4746,
  );
  bool _isChecked = false;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        child: Column(
          children: [
            const SizedBox(height: 40,),
                    Container(
                      height: 200,
                      child: GoogleMap(
              // padding: EdgeInsets.only(bottom: bottomPaddingMap),
            initialCameraPosition: _kGooglePlex, mapType: MapType.normal,
            myLocationEnabled: true, zoomGesturesEnabled: true, zoomControlsEnabled: true,
            myLocationButtonEnabled: true, onMapCreated: (GoogleMapController controller) {
              _controllerGoogleMap.complete(controller);
              newGoogleMapController =controller;              

              // locatePosition();
            },
            ),
            ),
                    // const SizedBox(height: 10,),
                    const Text('Select your location', style: TextStyle(color: Colors.green, fontWeight: FontWeight.w500, fontSize: 28, fontStyle: FontStyle.normal),),
                    const SizedBox(height: 10),
                    const Text('Set your location', style: TextStyle(color: Colors.grey, fontWeight: FontWeight.w500, fontSize: 20, fontStyle: FontStyle.normal),),
            
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("Your Zone", style: TextStyle(fontSize: 16),),
                  TextField(),
                  SizedBox(height: 10),
                  Text("Your Area", style: TextStyle(fontSize: 16),),
                  TextField(),
                ],
              ),
            ),
            const SizedBox(height: 0,),
            
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 15),
              child: Row(
              children: [    
                Checkbox(
                  activeColor: Colors.green,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  visualDensity: VisualDensity.compact,
                  value: _isChecked,
                  onChanged: (value) {
                        setState(() {	
                _isChecked = value!;	
                });
                 },
                ),    
                const Text("Detect my current location", style: TextStyle(color: Colors.grey, fontSize: 16)),    
              ]
          ),
            ),

            const SizedBox(height: 50,),

            Padding(
                      padding: const EdgeInsets.only(left: 20,right: 20),
                      child: ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.green[800]),
                  onPressed: (){ 
                    Navigator.pushReplacementNamed(context,Dashboard.id);
                  }, child: const Padding(
                    padding: EdgeInsets.all(8.0),
                    child: Text('Proceed',style: TextStyle(color: Colors.white, fontWeight: FontWeight.w400, fontSize: 25)),
                  )), ),
      
                    const SizedBox(height: 10,),
                   
                    const SizedBox(height: 70,),  
             Align(
                  alignment: Alignment.bottomCenter,
                  child: InkWell(
                    onTap: (){
                      Navigator.pushReplacementNamed(context,Dashboard.id);
                    },
                    child: Text("Skip >", style: TextStyle(fontSize: 20, color: Colors.green[400], fontWeight: FontWeight.w400),)))
          ],
        ),
      ),
    );
  }
}