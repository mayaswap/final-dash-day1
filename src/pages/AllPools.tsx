import React from 'react';
import Header from '../components/dashboard/Header';
import DashboardBody from '../components/dashboard/DashboardBody';

const AllPools = () => {
  return (
    <>
      <Header />
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <DashboardBody />
      </div>
    </>
  );
};

export default AllPools;