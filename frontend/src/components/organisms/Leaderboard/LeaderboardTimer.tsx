import { useReduxDispatch } from "@/redux/hooks";
import { setSingaporeDate } from "@/redux/slices/game";
import axios from "axios";
import { useState, useRef, useEffect } from "react";

let seconds_ = 59;
let minutes_ = 59;
let hours_ = 23;

export const LeaderboardTimer: React.FC = () => {
  const [timeCount, setTimeCount] = useState("08:35:24");
  const dispatch = useReduxDispatch();
  const timer = useRef(null);

  function timer_() {
    seconds_ -= 1;
    if (seconds_ < 0) {
      minutes_ = minutes_ - 1;
      seconds_ = 59;
      if (minutes_ < 0) {
        hours_ = hours_ - 1;
        minutes_ = 59;
      }
    }
    let hourst_str = hours_.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });

    let seconds_str = seconds_.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });

    let minutes_str = minutes_.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });

    setTimeCount(hourst_str + ":" + minutes_str + ":" + seconds_str);
  }

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}game/getSingapooreTime`)
      .then((result) => {
        result.data = result.data.data;
        dispatch(setSingaporeDate(result.data.singapore_date));
        console.log(result.data);
        let now = new Date(result.data.singapore_date);
        let target = new Date(result.data.singapore_date);
        now.setHours(
          result.data.hours,
          result.data.minutes,
          result.data.seconds,
          0
        );
        hours_ = 23 - result.data.hours;
        minutes_ = 59 - result.data.minutes;
        seconds_ = 60 - result.data.seconds;
        if (hours_ < 0) {
        }
        target.setHours(24, 24, 24, 24);
        setTimeCount(hours_ + ":" + minutes_ + ":" + seconds_);
      });
  }, [dispatch]);

  useEffect(() => {
    timer.current = setInterval(timer_, 1000);
    return () => clearTimeout(timer.current);
  }, []);

  return (
    <div
      className="flex flex-row items-center bg-[#424563] p-[16px] lg:p-[10px] rounded-[12px] my-[20px]"
    >
      <p className="text-[14px] font-medium text-white">
        Leaderboard resets in
      </p>
      <p className="text-[16px] font-bold text-white ml-auto">
        {timeCount}
      </p>
    </div>
  );
};
