'use client'

import React from 'react';
import TotalTroughputCard from './components/statistics/totalTroughputCard.tsx';
import DeltaTimePredictCard from './components/statistics/deltaTimePredictCard.tsx';
import AverageDailyTroughputCard from './components/statistics/averageDailyTroughputCard.tsx';


const Page = () => {
  const userId = 'aluno1'; 

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
