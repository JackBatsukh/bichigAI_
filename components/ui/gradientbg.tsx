import React from "react";
import Image from "next/image";

const GradientBackground = () => {
  return (
    <div className="min-h-screen w-full relative">
      <Image
        src="/bg1.png"
        alt="Background"
        width={889}
        height={704.5}
        className="absolute top-0 right-0"
      />
      <Image
        src="/bg2.png"
        alt="Background"
        width={891}
        height={744}
        className="absolute top-0 left-0"
      />
    </div>
  );
};

export default GradientBackground;
