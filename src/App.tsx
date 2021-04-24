import './App.css';
import React, { useState, useEffect } from 'react';
import CoreService from './core/CoreService';
import { CompanyContainer } from './components/CompanyContainer';
import ICompany from './models/ICompany';

function App() {
  const companiesCoreService = new CoreService('companies');

  const [companies, setStateCompanies] = useState<ICompany[]>([]);

  useEffect(() => {
    const fetchCompanies = async (): Promise<void> => {
      const companiesRes: ICompany[] = await getCompanies();
      setStateCompanies(companiesRes);
    }

    fetchCompanies();
  }, []);

  const getCompanies = async (): Promise<ICompany[]> => {
    const res: ICompany[] = await companiesCoreService.get();
    return res.map(company => { return { ...company, selectedTimeSlot: { start_time: '', end_time: '' } } });
  }

  const getCompany = async (id: number): Promise<ICompany> => {
    const res: ICompany = await companiesCoreService.find(id);
    return res;
  }

  return (
    <div className="container">
      {companies.map(company => {
        return (
          <CompanyContainer key={company.id} company={company} />
        )
      })}
    </div>
  );
}

export default App;