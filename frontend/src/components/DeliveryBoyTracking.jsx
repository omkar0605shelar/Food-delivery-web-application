import React from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import scooter from "../assets/scooter.png";
import home from "../assets/home.png";
import { Polyline } from "react-leaflet";

const deliveryBoyIcon = new L.Icon({
  iconUrl: scooter,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const customerIcon = new L.Icon({
  iconUrl: home,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

function DeliveryBoyTracking({ data }) {
  const deliveryBoyLat = data?.deliveryBoyLocation?.lat;
  const deliveryBoyLon = data?.deliveryBoyLocation?.lon;

  const customerLat = data?.customerLocation?.lat;
  const customerLon = data?.customerLocation?.lon;

  // ❗ Prevent map from rendering with undefined coords
  if (!deliveryBoyLat || !deliveryBoyLon) {
    return <p className="text-center text-gray-400">Waiting for location…</p>;
  }

  const path = [
    [deliveryBoyLat, deliveryBoyLon],
    [customerLat, customerLon],
  ];

  const center = [deliveryBoyLat, deliveryBoyLon];

  return (
    <div className="w-full h-[400px] mt-3 rounded-xl overflow-hidden shadow-md">
      <MapContainer className="w-full h-full" center={center} zoom={16}>
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* DELIVERY BOY MARKER */}
        <Marker position={path[0]} icon={deliveryBoyIcon}>
          <Popup>Delivery Boy</Popup>
        </Marker>

        {/* CUSTOMER MARKER (render only if available) */}
        {customerLat && customerLon && (
          <Marker position={path[1]} icon={customerIcon}>
            <Popup>Customer</Popup>
          </Marker>
        )}

        <Polyline positions={path} color="blue" weight={4}></Polyline>
      </MapContainer>
    </div>
  );
}

export default DeliveryBoyTracking;
