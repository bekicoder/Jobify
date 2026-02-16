"use client";
import { useState, useEffect } from "react";
import { useSharedState } from "../SharedStateContext";
import { text } from "stream/consumers";

const Stats = () => {
  const { content, bgColor, textColor,grayText,lightDark } = useSharedState();
  const stats = [
    { title: content?.job_posted,count:"150,000+",icon:"fa-briefcase",color:"blue" },
    { title: content?.active_users,count:"50,000+",icon:"fa-user-group",color:"green" },
    { title: content?.campany_amount,count:"10,000+",icon:"fa-building",color:"purple" }
  ];

  return (
    <div className={`flex flex-col md:flex-row justify-center items-center gap-8 px-4`}>
      {/* Jobs Posted */}
      {stats.map((stat,index)=>(
        <div key={index} className={`flex flex-col items-center bg-${lightDark} text-${textColor} rounded-2xl shadow-lg p-8 w-72 hover:scale-105 transition-transform duration-300`}>
        <div className={`bg-${stat.color}-100 p-4 rounded-full mb-4`}>
          <i className={`fa-solid fa-briefcase text-${stat.color}-600 text-2xl`}></i>
        </div>
        <h3 className={`text-xl font-semibold text-${grayText} mb-2`}>
          {stat.title}
        </h3>
        <p className={`text-3xl font-bold text-${stat.color}`}>{stat.count}</p>
      </div>
      ))}
    </div>
  );
};

export default Stats;
