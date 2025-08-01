import React from "react";
import HighlightText from "./HighlightText";
import know from "../../../assets/Images/Know_your_progress.svg";
import compare from "../../../assets/Images/Compare_with_others.svg";
import plan from "../../../assets/Images/Plan_your_lessons.svg";
import CTAButton from "./Button";
const LearningLanguageSection = () => {
  return (
    <div className="mt-[130px] mb-32">
      <div className="flex flex-col gap-5 items-center">
        <div className="text-4xl font-semibold text-center">
          Your Swiss knife for
          <HighlightText text={"learning any language"} />
        </div>

        <div className="text-center text-[#424854] mx-auto text-base mt-2 mb-4 font-medium w-[70%]">
          Using spin making learning multiple languages easy. with 20+ languages
          realistic voice-over, progress tracking, custom schedule and more.
        </div>
        <div className="flex flex-row items-center justify-center mt-5">
          <img src={know} alt="Know" className="object-contain -mr-32" />
          <img src={compare} alt="Know" className="object-contain  " />
          <img src={plan} alt="Know" className="object-contain -ml-36" />
        </div>

        <div className="w-fit ">
          <CTAButton active={true} linkto={"/signup"}>
            <div>Learn More</div>
          </CTAButton>
        </div>
      </div>
    </div>
  );
};

export default LearningLanguageSection;
