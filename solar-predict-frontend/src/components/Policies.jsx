import React, { useState } from "react";
import "./Policies.css";
import { FaSolarPanel, FaRegLightbulb, FaRegChartBar, FaSearch, FaShare, FaBookmark, FaChevronDown, FaChevronUp } from "react-icons/fa";

const policiesData = [
  {
    category: "National Solar Policies",
    icon: <FaSolarPanel />,
    policies: [
      {
        title: "National Solar Mission (NSM)",
        description: "Launched in 2010, NSM aims to establish India as a global leader in solar energy. The mission targets 500 GW non-fossil fuel capacity by 2030, with strong incentives for solar technology development and deployment. NSM encourages both centralized solar power projects and decentralized rooftop installations, ensuring clean energy for industries, agriculture, and households.",
        status: "Active",
        effectiveDate: "2010",
        target: "500 GW by 2030",
        eligibility: "All sectors",
        lastUpdated: "2024-01-15",
        link: "https://en.wikipedia.org/wiki/National_Solar_Mission" // Added link here

      },
      {
        title: "Pradhan Mantri Surya Ghar Muft Bijli Yojana (PMSGY)",
        description: "This scheme focuses on installing rooftop solar systems for 10 million households, providing up to 300 units of free electricity per month. It reduces household electricity bills and promotes energy independence.",
        status: "Active",
        effectiveDate: "2024",
        target: "10M households",
        eligibility: "Residential",
        lastUpdated: "2024-03-01",
        link : "https://www.india.gov.in/spotlight/details/pm-surya-ghar-muft-bijli-yojana"
      },
      {
        title: "Solar Rooftop Scheme",
        description: "Aims to promote rooftop solar installations across India. Over 1.4 crore registrations and 800,000+ houses solarized in a single year demonstrate its success. It enables households and small businesses to generate electricity while contributing to national renewable energy targets.",
        status: "Active",
        effectiveDate: "2019",
        target: "40 GW rooftop",
        eligibility: "Residential , Commercial",
        lastUpdated: "2024-02-20",
        link : "https://pmsuryaghar.gov.in/"
      },
      {
        title: "Incentives and Subsidies",
        description: "The central government provides financial incentives including capital subsidies, tax benefits, and net-metering to encourage solar adoption. Policies are designed to make solar installations affordable and accessible.",
        status: "Active",
        effectiveDate: "2015",
        target: "Nationwide",
        eligibility: "All consumers",
        lastUpdated: "2024-01-30",
        link : "https://blog.solarclue.com/blog/2025-solar-subsidies-by-state-complete-guide-to-government-schemes/#:~:text=The%20govt%20solar%20panel%20scheme%20offers%20financial%20assistance%2C,solar%20subsidy%20available%20in%20different%20states%20for%202025."
      },
    ],
  },
  {
    category: "Maharashtra Solar Policies",
    icon: <FaRegLightbulb />,
    policies: [
      {
        title: "Mukhyamantri Saur Krushi Vahini Yojana (MSKVY) 2.0",
        description: "World's largest decentralized solar project (16,000 MW) providing affordable electricity to farmers. Reduces distribution losses, promotes renewable energy jobs, and fosters clean energy adoption in rural areas.",
        status: "Active",
        effectiveDate: "2023",
        target: "16,000 MW",
        eligibility: "Agricultural",
        lastUpdated: "2024-02-15"
      },
      {
        title: "Solar Agricultural Pumps Funding",
        description: "Additional electricity sales tax on industrial and commercial consumers funds solar pumps for irrigation. Supports schemes like PM-KUSUM, ensuring reliable daytime electricity for farmers while reducing carbon footprint.",
        status: "Active",
        effectiveDate: "2022",
        target: "State-wide",
        eligibility: "Farmers",
        lastUpdated: "2024-01-10"
      },
      {
        title: "Solar Power Connections for Households",
        description: "Provides solar power connections to 10,000 homes annually in Maharashtra, both rural and urban. Helps reduce outages and encourages self-sufficient energy usage.",
        status: "Active",
        effectiveDate: "2021",
        target: "10,000 homes/year",
        eligibility: "Residential",
        lastUpdated: "2024-03-05"
      },
      {
        title: "Tax Exemptions for Solar Projects",
        description: "Includes exemptions on taxes and duties for large solar projects, e.g., sugarcane projects >3 MW. Land for solar/wind projects is considered non-agricultural, easing project deployment.",
        status: "Active",
        effectiveDate: "2020",
        target: "Large projects",
        eligibility: "Industrial & Commercial",
        lastUpdated: "2024-02-28"
      },
      {
        title: "State-Level Incentives & Benefits",
        description: "Maharashtra offers net-metering, low-interest loans, and priority approvals for rooftop and large-scale solar projects. Policies aim to accelerate the state's renewable energy targets and reduce dependency on fossil fuels.",
        status: "Active",
        effectiveDate: "2018",
        target: "State renewable goals",
        eligibility: "All sectors",
        lastUpdated: "2024-01-25"
      },
    ],
  },
  {
    category: "Benefits of Solar Policies",
    icon: <FaRegChartBar />,
    policies: [
      {
        title: "Environmental Impact",
        description: "Reduces greenhouse gas emissions, mitigates climate change, and decreases reliance on non-renewable energy sources.",
        impact: "High",
        beneficiaries: "General Public",
        timeline: "Long-term"
      },
      {
        title: "Economic Growth",
        description: "Promotes job creation in solar installation, maintenance, and manufacturing sectors. Encourages private investments in renewable energy projects.",
        impact: "High",
        beneficiaries: "Economy & Employment",
        timeline: "Medium-term"
      },
      {
        title: "Energy Security",
        description: "Decreases dependence on imported fuels, ensures reliable daytime electricity, and supports grid stability.",
        impact: "Critical",
        beneficiaries: "National Security",
        timeline: "Long-term"
      },
      {
        title: "Affordable Power",
        description: "Reduces household electricity bills and empowers communities through decentralized energy generation.",
        impact: "High",
        beneficiaries: "Consumers",
        timeline: "Immediate"
      },
    ],
  },
];

function Policies() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedSections, setExpandedSections] = useState({});
  const [savedPolicies, setSavedPolicies] = useState([]);

  const toggleSection = (index) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleSavePolicy = (policyTitle) => {
    setSavedPolicies(prev => 
      prev.includes(policyTitle) 
        ? prev.filter(title => title !== policyTitle)
        : [...prev, policyTitle]
    );
  };

  const filteredData = policiesData.map(section => ({
    ...section,
    policies: section.policies.filter(policy =>
      policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(section => section.policies.length > 0);

  return (
    <div className="policies-container">
      {/* Header Section */}
      <div className="policies-header">
        <div className="header-content">
          <h1>Solar Policy Insights</h1>
          <p className="header-subtitle">
            Comprehensive overview of national and state-level solar energy policies, incentives, and benefits
          </p>
        </div>
        <div className="header-actions">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search policies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          {/* <button className="action-btn secondary">
            <FaDownload />
            Export Report
          </button> */}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-value">{policiesData.reduce((acc, section) => acc + section.policies.length, 0)}</div>
          <div className="stat-label">Total Policies</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{policiesData[0].policies.length}</div>
          <div className="stat-label">National Policies</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{policiesData[1].policies.length}</div>
          <div className="stat-label">State Policies</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{savedPolicies.length}</div>
          <div className="stat-label">Saved Policies</div>
        </div>
      </div>

      {/* Policy Sections */}
      <div className="policy-sections">
        {filteredData.map((section, index) => (
          <div key={index} className="policy-section">
            <div className="section-header" onClick={() => toggleSection(index)}>
              <div className="section-title">
                <span className="section-icon">{section.icon}</span>
                <div>
                  <h2>{section.category}</h2>
                  <span className="policy-count">{section.policies.length} policies</span>
                </div>
              </div>
              <button className="expand-btn">
                {expandedSections[index] ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>
            
            {expandedSections[index] && (
              <div className="policy-cards">
                {section.policies.map((policy, idx) => (
                  <div key={idx} className="policy-card">
                    <div className="card-header">
                      <h3>{policy.title}</h3>
                      <div className="card-actions">
                        <button 
                          className={`icon-btn ${savedPolicies.includes(policy.title) ? 'saved' : ''}`}
                          onClick={() => toggleSavePolicy(policy.title)}
                        >
                          <FaBookmark />
                        </button>
                        <button className="icon-btn">
                          <FaShare />
                        </button>
                      </div>
                    </div>
                    
                    <div className="policy-meta">
                      {policy.status && (
                        <span className={`status-badge ${policy.status.toLowerCase()}`}>
                          {policy.status}
                        </span>
                      )}
                      {policy.effectiveDate && (
                        <span className="meta-item">Effective: {policy.effectiveDate}</span>
                      )}
                      {policy.target && (
                        <span className="meta-item">Target: {policy.target}</span>
                      )}
                      {policy.impact && (
                        <span className={`impact-badge ${policy.impact.toLowerCase()}`}>
                          {policy.impact} Impact
                        </span>
                      )}
                    </div>
                    
                    <p className="policy-description">{policy.description}</p>
                    
                    <div className="policy-details">
                      {policy.eligibility && (
                        <div className="detail-item">
                          <span className="detail-label">Eligibility:</span>
                          <span className="detail-value">{policy.eligibility}</span>
                        </div>
                      )}
                      {policy.lastUpdated && (
                        <div className="detail-item">
                          <span className="detail-label">Last Updated:</span>
                          <span className="detail-value">{policy.lastUpdated}</span>
                        </div>
                      )}
                      {policy.beneficiaries && (
                        <div className="detail-item">
                          <span className="detail-label">Beneficiaries:</span>
                          <span className="detail-value">{policy.beneficiaries}</span>
                        </div>
                      )}
                      {policy.timeline && (
                        <div className="detail-item">
                          <span className="detail-label">Timeline:</span>
                          <span className="detail-value">{policy.timeline}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="card-footer">
                      {policy.link && (
  <a 
    href={policy.link} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="action-btn primary"
  >
    Learn More
  </a>
)}
                      {/* <button className="action-btn outline">
                        Check Eligibility
                      </button> */}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredData.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No policies found</h3>
          <p>Try adjusting your search terms or browse all policies</p>
          <button 
            className="action-btn primary"
            onClick={() => setSearchTerm("")}
          >
            View All Policies
          </button>
        </div>
      )}
    </div>
  );
}

export default Policies;
