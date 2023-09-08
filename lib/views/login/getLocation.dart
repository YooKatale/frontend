// ignore_for_file: file_names


import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:yookatale/gradient/dashboard.dart';
import 'package:location/location.dart'  as loc;
import 'package:http/http.dart' as http;

class GetLocationScreen extends StatefulWidget {
  static const  String id='getLocation';
  const GetLocationScreen({Key? key}) : super(key: key);

  @override
  State<GetLocationScreen> createState() => _GetLocationScreenState();
}

class _GetLocationScreenState extends State<GetLocationScreen> {
  TextEditingController zoneTextController = TextEditingController();
  TextEditingController areaTextController = TextEditingController();
  late GoogleMapController controller;
  final LatLng center = const LatLng(0.347596, 32.582520);
  String googleApiKey ='AIzaSyDhbytrBgo8gUz5tgkprBXcTFiJ2BX386M';
  bool _isChecked = false;
  loc.LocationData? currentLocation;
  List<Marker> markers = [];

  void getCurrentLocation() async {
  loc.Location location = loc.Location();
  location.getLocation().then((location) async {
    currentLocation = location;
    String currentAddress = await getAddressFromCoordinates(
      location.latitude!, location.longitude!);
    zoneTextController.text = currentAddress;
  });
  GoogleMapController googleMapController = controller;
  location.onLocationChanged.listen((newLocation) {
    currentLocation = newLocation;
    // Update the map with the new location.
    googleMapController.animateCamera(
      CameraUpdate.newCameraPosition(
        CameraPosition(
          zoom: 11,
          target: LatLng(
            newLocation.latitude!, 
            newLocation.longitude!,
            ))));
            setState(() {
              
            });
  });
}
Future<String> getAddressFromCoordinates(double latitude, double longitude) async {
    final apiKey = googleApiKey;
    final apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=$latitude,$longitude&key=$apiKey';
    try {
      var response = await http.get(Uri.parse(apiUrl));
      if(response.statusCode == 200){
        Map<String, dynamic> data = json.decode(response.body);
        if(data['status'] == 'OK'){
          return data['results'][0]['formatted_address'];
        }
      }
    } catch (e) {
      print(e.toString());
    }
    return '';
  }
  void onMapCreated (mapController) {
    controller =  mapController;
  }

  @override
  void initState() {
    super.initState();
    getCurrentLocation();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        child: Column(
          children: [
            const SizedBox(height: 40,),
                    SizedBox(
                      height: 200,
                      child: GoogleMap(
                        initialCameraPosition: CameraPosition(target: center, zoom: 11.5), 
                        mapType: MapType.normal,
                        myLocationEnabled: true, 
                        zoomGesturesEnabled: true, 
                        zoomControlsEnabled: true,
                        myLocationButtonEnabled: true, 
                        onMapCreated: onMapCreated,
                        markers: {
                      ...markers.toSet(),                
                      if(currentLocation!=null)
                      Marker(
                        markerId: const MarkerId('current_location'),
                        position: LatLng(
                          currentLocation!.latitude!,
                          currentLocation!.longitude!
                        ),                  
                      ),                
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
                  const Text("Your Zone", style: TextStyle(fontSize: 16),),
                  TextField(
                    controller: zoneTextController,                    
                  ),
                  const SizedBox(height: 10),
                  const Text("Your Area", style: TextStyle(fontSize: 16),),
                  const TextField(),
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
                if(_isChecked) {
                  getCurrentLocation();
                }
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