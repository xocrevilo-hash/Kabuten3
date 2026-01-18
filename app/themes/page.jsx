'use client';

import React, { useState } from 'react';

export default function KabutenThemesPage() {
  const [expandedTheme, setExpandedTheme] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // All themes with their companies (alphabetically sorted)
  const themes = [
    {
      name: "AI & Semiconductors",
      count: 45,
      companies: [
        { code: "6857", name: "Advantest", price: "¥5,890", change: "+3.2%" },
        { code: "6146", name: "Disco", price: "¥42,150", change: "+1.8%" },
        { code: "6723", name: "Renesas", price: "¥2,456", change: "+2.1%" },
        { code: "6920", name: "Lasertec", price: "¥28,340", change: "+4.5%" },
        { code: "4063", name: "Shin-Etsu Chemical", price: "¥5,234", change: "+1.2%" },
        { code: "8035", name: "Tokyo Electron", price: "¥28,900", change: "+2.8%" },
      ]
    },
    {
      name: "Automotive",
      count: 38,
      companies: [
        { code: "7267", name: "Honda", price: "¥1,456", change: "-0.8%" },
        { code: "7269", name: "Suzuki", price: "¥1,678", change: "+0.5%" },
        { code: "7201", name: "Nissan", price: "¥567", change: "-1.2%" },
        { code: "7211", name: "Mitsubishi Motors", price: "¥456", change: "+0.3%" },
        { code: "7270", name: "Subaru", price: "¥2,890", change: "+1.1%" },
        { code: "7203", name: "Toyota", price: "¥2,890", change: "-0.3%" },
      ]
    },
    {
      name: "Banking & Finance",
      count: 32,
      companies: [
        { code: "8306", name: "MUFG", price: "¥1,567", change: "-0.5%" },
        { code: "8316", name: "Sumitomo Mitsui", price: "¥8,234", change: "+0.8%" },
        { code: "8411", name: "Mizuho", price: "¥2,890", change: "+0.3%" },
        { code: "8309", name: "Sumitomo Mitsui Trust", price: "¥3,456", change: "+1.2%" },
        { code: "8331", name: "Chiba Bank", price: "¥1,234", change: "-0.2%" },
      ]
    },
    {
      name: "Construction & Real Estate",
      count: 28,
      companies: [
        { code: "1801", name: "Taisei", price: "¥5,678", change: "+0.5%" },
        { code: "1802", name: "Obayashi", price: "¥1,234", change: "+0.8%" },
        { code: "1803", name: "Shimizu", price: "¥987", change: "-0.3%" },
        { code: "1925", name: "Daiwa House", price: "¥4,567", change: "+1.1%" },
        { code: "8830", name: "Sumitomo Realty", price: "¥5,234", change: "+0.6%" },
      ]
    },
    {
      name: "E-commerce & Internet",
      count: 24,
      companies: [
        { code: "4755", name: "Rakuten", price: "¥1,002", change: "+2.3%" },
        { code: "4689", name: "LY Corp (Yahoo Japan)", price: "¥428", change: "+0.5%" },
        { code: "4385", name: "Mercari", price: "¥2,345", change: "+1.8%" },
        { code: "3092", name: "ZOZO", price: "¥3,456", change: "+0.9%" },
        { code: "2413", name: "M3", price: "¥1,567", change: "-1.2%" },
      ]
    },
    {
      name: "Electronics & Technology",
      count: 42,
      companies: [
        { code: "6758", name: "Sony", price: "¥3,245", change: "+0.8%" },
        { code: "6861", name: "Keyence", price: "¥67,890", change: "-0.3%" },
        { code: "6501", name: "Hitachi", price: "¥12,345", change: "+1.5%" },
        { code: "6503", name: "Mitsubishi Electric", price: "¥2,345", change: "+0.6%" },
        { code: "6752", name: "Panasonic", price: "¥1,456", change: "-0.2%" },
        { code: "6702", name: "Fujitsu", price: "¥2,678", change: "+1.8%" },
      ]
    },
    {
      name: "EV & Batteries",
      count: 32,
      companies: [
        { code: "7203", name: "Toyota", price: "¥2,890", change: "-0.3%" },
        { code: "6752", name: "Panasonic", price: "¥1,456", change: "-0.2%" },
        { code: "6674", name: "GS Yuasa", price: "¥2,890", change: "+2.1%" },
        { code: "7267", name: "Honda", price: "¥1,456", change: "-0.8%" },
        { code: "6963", name: "Rohm", price: "¥1,890", change: "+0.5%" },
      ]
    },
    {
      name: "Fintech",
      count: 24,
      companies: [
        { code: "4755", name: "Rakuten", price: "¥1,002", change: "+2.3%" },
        { code: "8473", name: "SBI Holdings", price: "¥3,456", change: "+1.5%" },
        { code: "4385", name: "Mercari", price: "¥2,345", change: "+1.8%" },
        { code: "7182", name: "Japan Post Bank", price: "¥1,234", change: "+0.3%" },
        { code: "8697", name: "Japan Exchange Group", price: "¥3,890", change: "+0.8%" },
      ]
    },
    {
      name: "Food & Beverage",
      count: 26,
      companies: [
        { code: "2914", name: "Japan Tobacco", price: "¥4,123", change: "+0.5%" },
        { code: "2502", name: "Asahi Group", price: "¥5,678", change: "+0.8%" },
        { code: "2503", name: "Kirin", price: "¥2,123", change: "-0.3%" },
        { code: "2801", name: "Kikkoman", price: "¥1,890", change: "+1.2%" },
        { code: "2802", name: "Ajinomoto", price: "¥5,456", change: "+0.6%" },
      ]
    },
    {
      name: "Gaming & Entertainment",
      count: 18,
      companies: [
        { code: "7974", name: "Nintendo", price: "¥8,234", change: "+1.2%" },
        { code: "6758", name: "Sony", price: "¥3,245", change: "+0.8%" },
        { code: "9766", name: "Konami", price: "¥12,345", change: "+0.5%" },
        { code: "9697", name: "Capcom", price: "¥2,890", change: "+2.1%" },
        { code: "9684", name: "Square Enix", price: "¥5,678", change: "-0.8%" },
      ]
    },
    {
      name: "Healthcare & Pharmaceuticals",
      count: 35,
      companies: [
        { code: "4502", name: "Takeda", price: "¥4,123", change: "-0.5%" },
        { code: "4503", name: "Astellas", price: "¥1,567", change: "+0.3%" },
        { code: "4568", name: "Daiichi Sankyo", price: "¥4,890", change: "+1.8%" },
        { code: "4519", name: "Chugai Pharma", price: "¥6,234", change: "+0.9%" },
        { code: "4523", name: "Eisai", price: "¥5,678", change: "+2.5%" },
      ]
    },
    {
      name: "Insurance",
      count: 15,
      companies: [
        { code: "8766", name: "Tokio Marine", price: "¥5,234", change: "+0.8%" },
        { code: "8725", name: "MS&AD", price: "¥2,890", change: "+0.5%" },
        { code: "8630", name: "Sompo", price: "¥3,456", change: "+1.1%" },
        { code: "8750", name: "Dai-ichi Life", price: "¥3,234", change: "+0.3%" },
        { code: "7181", name: "Japan Post Insurance", price: "¥2,678", change: "-0.2%" },
      ]
    },
    {
      name: "Machinery & Industrial",
      count: 30,
      companies: [
        { code: "6301", name: "Komatsu", price: "¥4,567", change: "+1.2%" },
        { code: "6326", name: "Kubota", price: "¥2,123", change: "+0.8%" },
        { code: "7011", name: "Mitsubishi Heavy", price: "¥1,890", change: "+2.5%" },
        { code: "6305", name: "Hitachi Construction", price: "¥3,456", change: "+0.5%" },
        { code: "6302", name: "Sumitomo Heavy", price: "¥3,890", change: "+1.8%" },
      ]
    },
    {
      name: "Materials & Chemicals",
      count: 28,
      companies: [
        { code: "4063", name: "Shin-Etsu Chemical", price: "¥5,234", change: "+1.2%" },
        { code: "4188", name: "Mitsubishi Chemical", price: "¥890", change: "-0.5%" },
        { code: "4005", name: "Sumitomo Chemical", price: "¥345", change: "+0.3%" },
        { code: "4183", name: "Mitsui Chemicals", price: "¥3,456", change: "+0.8%" },
        { code: "3407", name: "Asahi Kasei", price: "¥1,123", change: "-0.2%" },
      ]
    },
    {
      name: "Renewable Energy",
      count: 22,
      companies: [
        { code: "9519", name: "Renova", price: "¥1,234", change: "+2.8%" },
        { code: "9517", name: "e-Rex", price: "¥890", change: "+1.5%" },
        { code: "6501", name: "Hitachi", price: "¥12,345", change: "+1.5%" },
        { code: "6503", name: "Mitsubishi Electric", price: "¥2,345", change: "+0.6%" },
        { code: "5019", name: "Idemitsu Kosan", price: "¥3,456", change: "+0.8%" },
      ]
    },
    {
      name: "Retail",
      count: 25,
      companies: [
        { code: "9983", name: "Fast Retailing", price: "¥45,678", change: "+1.5%" },
        { code: "8267", name: "Aeon", price: "¥3,234", change: "+0.5%" },
        { code: "3382", name: "Seven & i", price: "¥2,123", change: "-0.3%" },
        { code: "9843", name: "Nitori", price: "¥18,900", change: "+0.8%" },
        { code: "2651", name: "Lawson", price: "¥10,234", change: "+0.3%" },
      ]
    },
    {
      name: "Shipping & Logistics",
      count: 18,
      companies: [
        { code: "9101", name: "NYK Line", price: "¥4,567", change: "+1.8%" },
        { code: "9104", name: "Mitsui O.S.K.", price: "¥5,234", change: "+2.1%" },
        { code: "9107", name: "Kawasaki Kisen", price: "¥2,345", change: "+1.5%" },
        { code: "9064", name: "Yamato Holdings", price: "¥2,890", change: "-0.5%" },
        { code: "9062", name: "Nippon Express", price: "¥7,890", change: "+0.8%" },
      ]
    },
    {
      name: "Telecommunications",
      count: 20,
      companies: [
        { code: "9432", name: "NTT", price: "¥178", change: "-0.8%" },
        { code: "9433", name: "KDDI", price: "¥4,567", change: "+0.5%" },
        { code: "9434", name: "SoftBank Corp", price: "¥1,890", change: "+1.2%" },
        { code: "9984", name: "SoftBank Group", price: "¥8,234", change: "+3.5%" },
        { code: "4755", name: "Rakuten", price: "¥1,002", change: "+2.3%" },
      ]
    },
    {
      name: "Trading Companies",
      count: 12,
      companies: [
        { code: "8058", name: "Mitsubishi Corp", price: "¥2,890", change: "+0.8%" },
        { code: "8031", name: "Mitsui & Co", price: "¥7,234", change: "-0.5%" },
        { code: "8001", name: "Itochu", price: "¥6,890", change: "+1.2%" },
        { code: "8053", name: "Sumitomo Corp", price: "¥3,456", change: "+0.3%" },
        { code: "8002", name: "Marubeni", price: "¥2,345", change: "+0.5%" },
      ]
    },
    {
      name: "Utilities & Energy",
      count: 22,
      companies: [
        { code: "9501", name: "Tokyo Electric", price: "¥567", change: "+1.5%" },
        { code: "9502", name: "Chubu Electric", price: "¥1,890", change: "+0.8%" },
        { code: "9503", name: "Kansai Electric", price: "¥2,345", change: "+0.5%" },
        { code: "5020", name: "Eneos", price: "¥678", change: "+1.2%" },
        { code: "5019", name: "Idemitsu Kosan", price: "¥3,456", change: "+0.8%" },
      ]
    },
  ];

  // Filter themes based on search
  const filteredThemes = themes.filter(theme =>
    theme.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleTheme = (themeName) => {
    setExpandedTheme(expandedTheme === themeName ? null : themeName);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 text-sm">
      {/* Header */}
      <header className="bg-white border-b border-gray-300 px-4 py-2 flex justify-between items-center">
        <a href="/" className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs hover:bg-gray-50">
          ← Homepage
        </a>
        <h1 className="text-lg font-semibold">Kabuten 株典</h1>
        <a href="/ask" className="text-xs text-gray-500 hover:text-gray-800">Ask AI</a>
      </header>

      <div className="max-w-4xl mx-auto p-4">
        {/* Page Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold mb-2">Investment Themes</h1>
          <p className="text-gray-500">Browse companies by investment theme</p>
        </div>

        {/* Search Box */}
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search themes..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        {/* Theme Count */}
        <div className="text-sm text-gray-500 mb-4">
          {filteredThemes.length} themes • {filteredThemes.reduce((sum, t) => sum + t.count, 0)} companies total
        </div>

        {/* Themes List */}
        <div className="space-y-3">
          {filteredThemes.map((theme) => (
            <div key={theme.name} className="bg-white border border-gray-300 rounded-xl overflow-hidden">
              {/* Theme Header - Clickable */}
              <div
                onClick={() => toggleTheme(theme.name)}
                className="p-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className={`text-xl transition-transform ${expandedTheme === theme.name ? 'rotate-90' : ''}`}>
                    ▶
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-800">{theme.name}</h3>
                    <p className="text-xs text-gray-400">{theme.count} companies</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                  {theme.count}
                </span>
              </div>

              {/* Expanded Companies List */}
              {expandedTheme === theme.name && (
                <div className="border-t border-gray-200 bg-gray-50">
                  <div className="p-4">
                    <div className="grid grid-cols-1 gap-2">
                      {theme.companies.map((company) => (
                        <a
                          key={company.code}
                          href={`/company/${company.code}`}
                          className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-400 font-mono w-12">{company.code}</span>
                            <span className="font-medium text-gray-800">{company.name}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-semibold">{company.price}</span>
                            <span className={`font-medium text-sm ${
                              company.change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'
                            }`}>
                              {company.change}
                            </span>
                          </div>
                        </a>
                      ))}
                    </div>
                    <div className="mt-3 text-center">
                      <span className="text-gray-400 text-xs">
                        Showing top companies in {theme.name}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-400">
          <p>Companies may appear in multiple themes</p>
        </div>
      </div>
    </div>
  );
}
