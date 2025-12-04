import React, { useState, useEffect } from 'react';
import './App.css';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ScatterChart, Scatter, PieChart, Pie, Cell,
  ResponsiveContainer
} from 'recharts';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const COLORS = ['#3b82f6', '#10b981', '#f97316', '#ec4899', '#6366f1'];

function App() {
  const [selectedDietType, setSelectedDietType] = useState('All Diet Types');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [nutritionalData, setNutritionalData] = useState(null);
  const [recipesData, setRecipesData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dietTypes = ['All Diet Types', 'Vegan', 'Keto', 'Mediterranean', 'Dash', 'Paleo'];

  // Fetch nutritional insights
  const fetchNutritionalInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/nutritional-insights.json`);
      const data = await response.json();
      setNutritionalData(data);
    } catch (err) {
      setError('Failed to fetch nutritional insights');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch recipes
  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/recipes.json`);
      const data = await response.json();
      setRecipesData(data);
    } catch (err) {
      setError('Failed to fetch recipes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch clusters
  const fetchClusters = async () => {
    setLoading(true);
    setError(null);
    try {
      await fetch(`${API_BASE_URL}/clusters.json`);
      alert('Clusters data loaded successfully!');
    } catch (err) {
      setError('Failed to fetch clusters');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on component mount
  useEffect(() => {
    fetchNutritionalInsights();
  }, []);

  // Prepare chart data
  const prepareBarChartData = () => {
    if (!nutritionalData) return [];
    return Object.entries(nutritionalData.average_macronutrients || {}).map(([diet, values]) => ({
      diet: diet.charAt(0).toUpperCase() + diet.slice(1),
      Protein: values.protein_g,
      Carbs: values.carbs_g,
      Fat: values.fat_g
    }));
  };

  const prepareScatterData = () => {
    if (!recipesData?.recipes) return [];
    return recipesData.recipes.map(recipe => ({
      x: recipe.carbs_g || 0,
      y: recipe.protein_g || 0,
      name: recipe.recipe_name
    }));
  };

  const preparePieData = () => {
    if (!nutritionalData) return [];
    return Object.keys(nutritionalData.average_macronutrients || {}).map(diet => ({
      name: diet.charAt(0).toUpperCase() + diet.slice(1),
      value: 1
    }));
  };

  const prepareHeatmapData = () => {
    if (!nutritionalData) return [];
    return Object.entries(nutritionalData.average_macronutrients || {}).map(([diet, values]) => ({
      diet: diet.charAt(0).toUpperCase() + diet.slice(1),
      protein: values.protein_g,
      carbs: values.carbs_g,
      fat: values.fat_g
    }));
  };

  return (
    <div className="App">

      {/* Header */}
      <header className="app-header">
        <h1>Nutritional Insights</h1>
      </header>

      {/* Main Content */}
      <div className="main-content">

        {/* Explore Section */}
        <section className="explore-section">
          <h2>Explore Nutritional Insights</h2>

          <div className="charts-grid">

            {/* ------------------------ */}
            {/* Modern Bar Chart */}
            {/* ------------------------ */}
            <div className="chart-card">
              <h3>Bar Chart</h3>
              <p>Average macronutrient content by diet type.</p>

              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={prepareBarChartData()}
                  margin={{ top: 15, right: 20, bottom: 5, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="diet" tick={{ fill: "#374151", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#374151", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      borderColor: "#e5e7eb",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                      fontSize: "12px"
                    }}
                  />
                  <Legend />

                  <Bar dataKey="Protein" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="Carbs" fill="#10b981" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="Fat" fill="#f97316" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* ------------------------ */}
            {/* Modern Scatter Chart */}
            {/* ------------------------ */}
            <div className="chart-card">
              <h3>Scatter Plot</h3>
              <p>Nutrient relationships (protein vs carbs).</p>

              <ResponsiveContainer width="100%" height={250}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="x" name="Carbs" tick={{ fill: "#374151", fontSize: 12 }} />
                  <YAxis dataKey="y" name="Protein" tick={{ fill: "#374151", fontSize: 12 }} />

                  <Tooltip cursor={{ stroke: "#d1d5db", strokeDasharray: "3 3" }} />
                  <Scatter data={prepareScatterData()} fill="#6366f1" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            {/* ------------------------ */}
            {/* Modern Heatmap (Stacked Bars) */}
            {/* ------------------------ */}
            <div className="chart-card">
              <h3>Heatmap</h3>
              <p>Nutrient correlations.</p>

              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={prepareHeatmapData()} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" tick={{ fill: "#374151", fontSize: 12 }} />
                  <YAxis type="category" dataKey="diet" tick={{ fill: "#374151", fontSize: 12 }} />

                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                      fontSize: "12px"
                    }}
                  />
                  <Legend />

                  <Bar dataKey="protein" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="carbs" fill="#10b981" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="fat" fill="#f97316" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* ------------------------ */}
            {/* Modern Pie Chart */}
            {/* ------------------------ */}
            <div className="chart-card">
              <h3>Pie Chart</h3>
              <p>Recipe distribution by diet type.</p>

              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                      fontSize: "12px"
                    }}
                  />
                  <Pie
                    data={preparePieData()}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    labelLine={false}
                    label={(entry) => entry.name}
                    stroke="none"
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {preparePieData().map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

          </div>
        </section>

        {/* ------------------------ */}
        {/* FILTERS SECTION (unchanged) */}
        {/* ------------------------ */}
        <section className="filters-section">
          <h2>Filters and Data Interaction</h2>

          <div className="filter-controls">
            <input
              type="text"
              placeholder="Search by Diet Type"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />

            <div className="dropdown">
              <button className="dropdown-button">
                {selectedDietType} ▼
              </button>
              <div className="dropdown-content">
                {dietTypes.map(diet => (
                  <div
                    key={diet}
                    onClick={() => setSelectedDietType(diet)}
                    className={selectedDietType === diet ? 'selected' : ''}
                  >
                    {selectedDietType === diet && '✓'} {diet}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------ */}
        {/* API SECTION (unchanged) */}
        {/* ------------------------ */}
        <section className="api-section">
          <h2>API Data Interaction</h2>

          <div className="api-buttons">
            <button
              onClick={fetchNutritionalInsights}
              disabled={loading}
              className="api-button primary"
            >
              {loading ? 'Loading...' : 'Get Nutritional Insights'}
            </button>

            <button
              onClick={fetchRecipes}
              disabled={loading}
              className="api-button success"
            >
              {loading ? 'Loading...' : 'Get Recipes'}
            </button>

            <button
              onClick={fetchClusters}
              disabled={loading}
              className="api-button info"
            >
              {loading ? 'Loading...' : 'Get Clusters'}
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {nutritionalData && (
            <div className="data-display">
              <h3>Nutritional Data:</h3>
              <p>Total Recipes: {nutritionalData.total_recipes}</p>
              <p>Diet Types: {nutritionalData.diet_types?.join(', ')}</p>
            </div>
          )}
        </section>

        {/* ------------------------ */}
        {/* PAGINATION (unchanged) */}
        {/* ------------------------ */}
        <section className="pagination-section">
          <h2>Pagination</h2>
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <button className="page-number active">{currentPage}</button>
            <button className="page-number">{currentPage + 1}</button>

            <button onClick={() => setCurrentPage(prev => prev + 1)}>
              Next
            </button>
          </div>
        </section>

        {/* (Security, OAuth, Cleanup Sections unchanged — keeping exactly as you wrote) */}
        {/* -------------------------------------------------------------- */}
        {/* SECURITY */}
        <div style={{
          margin: '40px 0',
          padding: '30px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#6B46C1', marginBottom: '20px' }}>Security & Compliance</h2>

          <div style={{ marginTop: '20px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>Security Status</h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px'
            }}>
              <div style={{
                padding: '15px',
                background: '#F7FAFC',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>Encryption:</span>
                <span style={{ color: '#38A169', fontWeight: 'bold' }}>Enabled</span>
              </div>

              <div style={{
                padding: '15px',
                background: '#F7FAFC',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>Access Control:</span>
                <span style={{ color: '#38A169', fontWeight: 'bold' }}>Secure</span>
              </div>

              <div style={{
                padding: '15px',
                background: '#F7FAFC',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>Compliance:</span>
                <span style={{ color: '#38A169', fontWeight: 'bold' }}>GDPR Compliant</span>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------ */}
        {/* OAUTH & 2FA */}
        <div style={{
          margin: '40px 0',
          padding: '30px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#6B46C1', marginBottom: '20px' }}>OAuth & 2FA Integration</h2>

          <div style={{ marginTop: '20px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>Secure Login</h3>

            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <button
                onClick={() => window.location.href = 'http://localhost:5000/auth/google'}
                style={{
                  padding: '12px 24px',
                  background: '#4285F4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Login with Google
              </button>

              <button
                onClick={() => window.location.href = 'http://localhost:5000/auth/github'}
                style={{
                  padding: '12px 24px',
                  background: '#333',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Login with GitHub
              </button>
            </div>
          </div>

          <div style={{ marginTop: '30px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>Enter 2FA Code</h3>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Enter your 2FA code"
                maxLength="6"
                style={{
                  padding: '12px',
                  fontSize: '18px',
                  letterSpacing: '5px',
                  textAlign: 'center',
                  border: '2px solid #E2E8F0',
                  borderRadius: '8px',
                  width: '200px'
                }}
              />

              <button style={{
                padding: '12px 24px',
                background: '#38A169',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px'
              }}>
                Verify
              </button>
            </div>
          </div>
        </div>

        {/* ------------------------ */}
        {/* CLOUD CLEANUP */}
        <div style={{
          margin: '40px 0',
          padding: '30px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#6B46C1', marginBottom: '20px' }}>Cloud Resource Cleanup</h2>

          <p style={{ color: '#718096', marginBottom: '20px' }}>
            Ensure that cloud resources are managed and cleaned up efficiently.
          </p>

          <button
            onClick={() => alert('Cleanup will remove unused Azure resources.')}
            style={{
              padding: '15px 30px',
              background: '#E53E3E',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Clean Up Resources
          </button>
        </div>

      </div>

      {/* Footer */}
      <footer className="app-footer">
        <p>© 2025 Nutritional Insights. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;
