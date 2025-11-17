import React from 'react'
import { useSelector } from 'react-redux'
import UserDashBoard from '../components/UserDashBoard';
import OwnerDashBoard from '../components/OwnerDashBoard';
import DeliveryBoy from '../components/DeliveryBoy';

function Home() {
  const {userData} = useSelector(state => state.user);
  return (
    <div className='w-[100vw] min-h-[100vh] pt-[100px] flex felx-col items-center bg-[#fff9f6]'>
      {userData.role === "user" && <UserDashBoard />}
      {userData.role === 'owner' && <OwnerDashBoard />}
      {userData.role === 'deliveryBoy' && <DeliveryBoy/>}
    </div>
  )
}

export default Home