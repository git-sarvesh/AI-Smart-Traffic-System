import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './styles/App.css';
import TrafficDashboard from './components/TrafficDashboard';
import TrafficAnalysis from './components/TrafficAnalysis';
import RouteOptimization from './components/RouteOptimization';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

function App() {
  const [trafficData, setTrafficData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const analyzeTraffic = async (intersectionData) => {
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = `Analyze this traffic data and provide optimization recommendations:\n${JSON.stringify(intersectionData)}\nProvide: 1) Congestion level, 2) Recommended signal timing, 3) Predicted peak times`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      setAnalysis(response.text());
    } catch (error) {
      console.error('Analysis error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚦 AI Smart Traffic System</h1>
        <p>Real-time traffic analysis and optimization powered by Google Gemini</p>
      </header>
      <nav className="nav-tabs">
        <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
        <button className={activeTab === 'analysis' ? 'active' : ''} onClick={() => setActiveTab('analysis')}>Analysis</button>
        <button className={activeTab === 'routes' ? 'active' : ''} onClick={() => setActiveTab('routes')}>Route Optimization</button>
      </nav>
      <main className="app-main">
        {activeTab === 'dashboard' && <TrafficDashboard onAnalyze={analyzeTraffic} />}
        {activeTab === 'analysis' && <TrafficAnalysis analysis={analysis} loading={loading} />}
        {activeTab === 'routes' && <RouteOptimization />}
      </main>
    </div>
  );
}

export default App;
