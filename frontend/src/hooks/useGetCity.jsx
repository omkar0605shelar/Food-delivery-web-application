import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAddress, setCity, setState } from "../redux/userSlice";

function useGetCity() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const apiKey = import.meta.env.VITE_GEOAPIKEY;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`
      );

      console.log(result.data.results[0].city);
      dispatch(setCity(result?.data?.results[0].city));
      dispatch(setState(result?.data?.results[0].state));
      dispatch(
        setAddress(
          [
            result.data.results[0].address_line1,
            result.data.results[0].address_line2,
          ]
            .filter(Boolean)
            .join(", ")
        )
      );

      console.log(result?.data);
    });
  }, [userData]);
}

export default useGetCity;
