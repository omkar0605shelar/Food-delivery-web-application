import { Marker, useMap } from "react-leaflet";

function DraggableMarker({ location, onDragEnd }) {
  const map = useMap(); // ONLY allowed here inside MapContainer child

  const handleDragEnd = (e) => {
    const { lat, lng } = e.target._latlng;

    // Send new coords to parent
    onDragEnd(lat, lng);

    // Recenter map
    map.setView([lat, lng], 16, { animate: true });
  };

  return (
    <Marker
      position={[location.lat, location.lon]}
      draggable={true}
      eventHandlers={{
        dragend: handleDragEnd,
      }}
    />
  );
}

export default DraggableMarker;
