import './App.css';
import React, { useState, useEffect } from 'react';
import CoreService from './core/CoreService';

interface Time_slot {
  start_time: string,
  end_time: string,
}

interface Company {
  id: number,
  name: string,
  type: string,
  time_slots: Time_slot[],
}

function App() {
  const companiesCoreService = new CoreService('companies');

  const [companies, setStateCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const fetchCompanies = async (): Promise<void> => {
      const companiesRes: Company[] = await getCompanies();
      setStateCompanies(companiesRes);
    }

    fetchCompanies();
  }, []);

  const getCompanies = async (): Promise<Array<Company>> => {
    const res: Company[] = await companiesCoreService.get();
    console.log(res)
    return res;
  }

  const getCompany = async (id: number): Promise<Company> => {
    const res: Company = await companiesCoreService.find(id);
    return res;
  }

  return (
    <div className="container">
      working...
    </div>
  );
}

export default App;