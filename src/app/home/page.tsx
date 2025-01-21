'use client'

import React from 'react';
import TotalTroughputCard from './components/statistics/totalTroughputCard';
import DeltaTimePredictCard from './components/statistics/deltaTimePredictCard';
import AverageDailyTroughputCard from './components/statistics/averageDailyTroughputCard';


const Page = () => {
  const userId = 'user_2pPbWrKiNVfCPZEjIU8RL3zwA1e'; 

  return (
    <div>
        <div>
            
            <TotalTroughputCard userId={userId} />
        </div>
        <div style={{marginTop: '50px'}}>
            
            <DeltaTimePredictCard userId={userId} />
        </div>
        <div style={{marginTop: '50px'}}>
            
            <AverageDailyTroughputCard userId={userId} />
        </div>
    </div>
  );
};

export default Page;
