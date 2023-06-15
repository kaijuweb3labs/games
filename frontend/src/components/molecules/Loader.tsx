import React from "react";
import Lottie from "react-lottie";
import loadingAnimationData from "../../assets/animations/loading.json";
function Loader() {
  return (
    <div className="flex w-full h-screen justify-center items-center z-50 absolute bg-[#1c1d29]">
      <Lottie
        options={{
          loop: true,
          autoplay: true,
          animationData: loadingAnimationData,
          rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
          },
        }}
        height={200}
        width={200}
        isStopped={false}
        isPaused={false}
      />
    </div>
  );
}

export default Loader;
