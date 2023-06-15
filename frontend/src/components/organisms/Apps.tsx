import { useEffect, useState } from "react";
import axios from 'axios';
import QRCodeModel from "./Modals/QRCodeModal";
import { useReduxDispatch } from "@/redux/hooks";
import { setQrModal } from "@/redux/slices/modals";

const Apps: React.FC = () => {
  const [timeCount , setTimeCount] = useState("08:35:24")
  const [isFetchTime , setIsFetchTime] = useState(true)
  const [targetTime , setTargetTime] = useState(0)
  const dispatch = useReduxDispatch();

  let seconds_ = 59
  let minutes_=59
  let hours_ = 23

  function timer_() {
    seconds_-=1
    if(seconds_<0){
      minutes_=minutes_ - 1
      seconds_= 59
      if(minutes_<0){
        hours_ = hours_-1
        minutes_ = 59
    }
  }
  let hourst_str = hours_.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false
  })

  let seconds_str = seconds_.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false
  })

  let minutes_str = minutes_.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false
  })

  setTimeCount(hourst_str+":"+minutes_str+":"+seconds_str)
}

var timer

  useEffect(()=>{
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}game/getSingapooreTime`)
    .then(result => {
            result.data = result.data.data
            console.log(result.data)
            let now = new Date(result.data.singapore_date);
            let target = new Date(result.data.singapore_date);
            now.setHours(result.data.hours, result.data.minutes, result.data.seconds, 0);
            hours_ = 23-result.data.hours
            minutes_ = 59-result.data.minutes
            seconds_ = 60-result.data.seconds
            if(hours_<0){

            }
            target.setHours(24, 24,24, 24);
            var timeDiff = target.getTime() - now.getTime();
            setTargetTime(target.getTime())
            setTimeCount(hours_+":"+minutes_+":"+seconds_)
            setIsFetchTime(false)
          })
  },[])
  useEffect(()=>{
      timer = setInterval(timer_, 1000);
      return()=>clearTimeout(timer)
  },[])

  return (
    <div className="flex-col items-center relative mt-[24px] lg:mt-0">
      <h3 className="text-[14px] font-bold text-[#C64CB8] text-center lg:text-left">
        Download Kaiju Wallet
      </h3>
      <div className="flex flex-row lg:flex-col space-x-[9px] lg:space-y-[8px] lg:space-x-0 mt-[12px]">
        <div className="app-button" onClick={()=>{
          dispatch(setQrModal({isOpen: true, appType: 'android'}))
        }}>
          <img src="/googlePlay.svg" alt="Google Play" className="app-image" />
        </div>
        <div className="app-button" onClick={()=>{
          dispatch(setQrModal({isOpen: true, appType: 'ios'}))
        }}>
          <img src="/appStore.svg" alt="App Store" className="app-image" />
        </div>
      </div>
      <div
        className="flex flex-row lg:flex-col items-center bg-[#424563] p-[16px] lg:px-[10px] lg:py-[8px]
        rounded-[12px] lg:absolute -bottom-[70px] right-0 mt-[32px]">
        <p className="text-[12px] lg:text-[8px] font-bold text-white">
          The leaderboard
        </p>
        <p className="text-[12px] lg:text-[8px] ml-[4px] lg font-bold text-white">
          will be reseted in
        </p>
        <p className="text-[16px] lg:text-[12px] ml-auto lg:ml-0 font-bold text-white">
          {timeCount}
        </p>
      </div>
    </div>
  );
};

export default Apps;