import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ChartEditor } from './pages/ChartEditor';
import { Account } from './pages/Account';
import { Templates } from './pages/Templates';
import { TemplateDetails } from './pages/TemplateDetails';
import { Premium } from './pages/Premium';
import { TermsOfService } from './pages/TermsOfService';
import { UserProfile } from './pages/UserProfile';
import { Studio } from './pages/Studio';

export default function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<ChartEditor />} />
        <Route path="/account" element={<Account />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/templates/:id" element={<TemplateDetails />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/user/:username" element={<UserProfile />} />
        <Route path="/studio" element={<Studio />} />
      </Routes>
    </div>
  );
}