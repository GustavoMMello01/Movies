import React from "react";

const WelcomeBanner = ({ title, text }) => {
  return (
    <div className="bg-blue-500 dark:bg-blue-600 text-white p-6 rounded-lg shadow-lg mb-6">
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-lg">{text}</p>
    </div>
  );
};

export default WelcomeBanner;
