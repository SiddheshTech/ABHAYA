import React, { useState } from "react";
import { 
  Building2, Shield, Search, Plus, Filter, Globe, Users, CheckCircle2, 
  Trash2, Phone, X, Award, CheckSquare, Layers, Radio, Activity, ChevronRight
} from "lucide-react";

interface OrganizationsViewProps {
  highContrast?: boolean;
}

interface Organization {
  id: string;
  name: string;
  type: "Police" | "NGO" | "Shelter" | "Hospital" | "CWC" | "Government Agency";
  state: string;
  contact: string;
  personnel: number;
  status: "Verified" | "Pending Access";
  performance: string;
  compliance: string;
  casesHandled: number;
}

export default function OrganizationsView({ highContrast }: OrganizationsViewProps) {
  const [selectedType, setSelectedType] = useState<string>("Police");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Organization Form States
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<Organization["type"]>("Police");
  const [newState, setNewState] = useState("");
  const [newContact, setNewContact] = useState("");
  const [newPersonnel, setNewPersonnel] = useState("12");

  const [orgs, setOrgs] = useState<Organization[]>([
    { id: "ORG-092", name: "Maharashtra State Police Hub", type: "Police", state: "Maharashtra", contact: "+91 22 2262 0111", personnel: 45, status: "Verified", performance: "96%", compliance: "99%", casesHandled: 480 },
    { id: "ORG-115", name: "Bal Raksha NGO India", type: "NGO", state: "Delhi-NCR", contact: "+91 11 4056 9412", personnel: 120, status: "Verified", performance: "94%", compliance: "98%", casesHandled: 910 },
    { id: "ORG-204", name: "Delhi Juvenile CWC Unit", type: "CWC", state: "Delhi-NCR", contact: "+91 11 2301 5218", personnel: 32, status: "Verified", performance: "92%", compliance: "100%", casesHandled: 340 },
    { id: "ORG-308", name: "Sankalp Safe Shelter Mission", type: "Shelter", state: "Bihar", contact: "+91 612 258 0912", personnel: 85, status: "Verified", performance: "95%", compliance: "95%", casesHandled: 290 },
    { id: "ORG-441", name: "National Child Protection Agency", type: "Government Agency", state: "Karnataka", contact: "+91 80 2235 4411", personnel: 18, status: "Pending Access", performance: "88%", compliance: "92%", casesHandled: 120 }
  ]);

  const bgCard = highContrast ? "bg-stone-950 border-stone-800" : "bg-stone-900/95 border-stone-800 text-stone-100";
  const borderCol = highContrast ? "border-stone-850" : "border-stone-800/80";
  const textMain = highContrast ? "text-yellow-300" : "text-white";
  const textMuted = highContrast ? "text-stone-400" : "text-stone-400 font-mono text-[11px]";

  const handleCreateOrg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newState.trim()) return;

    const newOrg: Organization = {
      id: `ORG-${Math.floor(100 + Math.random() * 900)}`,
      name: newName,
      type: newType,
      state: newState,
      contact: newContact || "+91 99887 76655",
      personnel: parseInt(newPersonnel) || 10,
      status: "Verified",
      performance: "94%",
      compliance: "98%",
      casesHandled: 10
    };

    setOrgs([newOrg, ...orgs]);
    setIsModalOpen(false);
    
    // Reset form
    setNewName("");
    setNewState("");
    setNewContact("");
    setNewPersonnel("12");
  };

  const handleDeleteOrg = (id: string) => {
    setOrgs(orgs.filter(o => o.id !== id));
  };

  const filteredOrgs = orgs.filter(o => {
    const matchesSearch = o.name.toLowerCase().includes(searchTerm.toLowerCase()) || o.state.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "All" || o.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Get metrics based on currently selected hub category
  const categorySummary = orgs.filter(o => o.type === selectedType);
  const totalCasesCategory = categorySummary.reduce((acc, curr) => acc + curr.casesHandled, 0);
  const totalPersonnelCategory = categorySummary.reduce((acc, curr) => acc + curr.personnel, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-350 select-none">
      
      {/* Immersive HUD Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-stone-950 p-4 rounded-2xl border border-stone-850">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-sm font-black tracking-widest text-emerald-400 font-mono uppercase">
              NATIONAL COLLABORATION CENTER
            </h1>
          </div>
          <h2 className="text-xl font-black tracking-tight text-white mt-1">
            Rakshak Organization Network Registry
          </h2>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className={`px-5 py-2.5 rounded-xl font-bold font-mono text-xs flex items-center gap-2 cursor-pointer transition-all ${
            highContrast ? "bg-stone-900 text-yellow-300 border border-yellow-300 hover:bg-stone-800" : "bg-[#115e3b] hover:bg-[#0c4e30] text-white"
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>REGISTER INSTITUTION</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Organizations Quick Navigation */}
        <div className="lg:col-span-3 space-y-4">
          <div className={`p-4 rounded-2xl border ${bgCard} shadow-xl space-y-4 h-[440px] overflow-y-auto`}>
            
            <div className="border-b border-stone-850 pb-3">
              <h3 className="font-black text-xs uppercase tracking-widest text-emerald-400 font-mono flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Network Nodes
              </h3>
              <p className="text-[10px] text-stone-500 mt-1 uppercase">Visual integration categories</p>
            </div>

            {/* List selector of hub nodes */}
            <div className="space-y-2">
              {["Police", "NGO", "Shelter", "Hospital", "CWC", "Government Agency"].map((cat) => (
                <div
                  key={cat}
                  onClick={() => setSelectedType(cat)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer text-xs flex justify-between items-center ${
                    selectedType === cat
                      ? "bg-emerald-950/40 border-emerald-900 text-emerald-400"
                      : "bg-stone-950/50 border-stone-900 hover:border-stone-800 text-stone-350"
                  }`}
                >
                  <span className="font-bold">{cat} Node Hub</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
                </div>
              ))}
            </div>

            {/* Verification checks */}
            <div className="p-3 bg-stone-950 rounded-xl border border-stone-900 text-xs text-stone-400 font-mono">
              <p className="text-[10px] text-stone-500 uppercase font-bold">Node Compliance Rule</p>
              <p className="mt-1 leading-relaxed text-[11px]">All connected agencies undergo strict compliance checks to ensure full protection of child data registries.</p>
            </div>

          </div>
        </div>

        {/* Center Panel: SVG Visual Org Map Hub */}
        <div className="lg:col-span-6 space-y-4">
          <div className={`p-5 rounded-2xl border ${bgCard} shadow-2xl flex flex-col justify-between h-[440px] relative overflow-hidden`}>
            
            <div className="border-b border-stone-850 pb-3">
              <h3 className="font-black text-xs uppercase tracking-widest text-emerald-400 font-mono">
                ORGANIZATION NETWORK CONNECTOR
              </h3>
              <p className="text-[10px] text-stone-500 uppercase mt-0.5">Visually connected child recovery agency grid</p>
            </div>

            {/* Interactive SVG Connector diagram representing Police, NGOs, Shelters, CWC, Hospitals, Govt Agencies */}
            <div className="flex-1 flex items-center justify-center relative">
              <svg viewBox="0 0 500 300" className="w-full h-full max-h-[250px]">
                {/* Lines mapping out connections */}
                <line x1="250" y1="150" x2="100" y2="80" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="250" y1="150" x2="400" y2="80" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="250" y1="150" x2="100" y2="220" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="250" y1="150" x2="400" y2="220" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="250" y1="150" x2="250" y2="50" stroke="#10b981" strokeWidth="1.5" />
                <line x1="250" y1="150" x2="250" y2="250" stroke="#10b981" strokeWidth="1.5" />

                {/* Central Government Hub Node */}
                <g className="cursor-pointer" onClick={() => setSelectedType("Government Agency")}>
                  <circle cx="250" cy="150" r="22" className={`fill-emerald-950/80 stroke-emerald-500 stroke-2 ${selectedType === "Government Agency" ? "animate-pulse" : ""}`} />
                  <text x="250" y="153" textAnchor="middle" className="text-[8px] fill-white font-black font-mono">GOVT</text>
                </g>

                {/* Police Node Hub */}
                <g className="cursor-pointer" onClick={() => setSelectedType("Police")}>
                  <circle cx="100" cy="80" r="18" className={`fill-stone-950 stroke-emerald-500 ${selectedType === "Police" ? "stroke-2 fill-emerald-950/20" : "opacity-70"}`} />
                  <text x="100" y="83" textAnchor="middle" className="text-[8px] fill-stone-300 font-mono">POLICE</text>
                </g>

                {/* NGO Hub */}
                <g className="cursor-pointer" onClick={() => setSelectedType("NGO")}>
                  <circle cx="400" cy="80" r="18" className={`fill-stone-950 stroke-emerald-500 ${selectedType === "NGO" ? "stroke-2 fill-emerald-950/20" : "opacity-70"}`} />
                  <text x="400" y="83" textAnchor="middle" className="text-[8px] fill-stone-300 font-mono">NGOs</text>
                </g>

                {/* Shelter Hub */}
                <g className="cursor-pointer" onClick={() => setSelectedType("Shelter")}>
                  <circle cx="100" cy="220" r="18" className={`fill-stone-950 stroke-emerald-500 ${selectedType === "Shelter" ? "stroke-2 fill-emerald-950/20" : "opacity-70"}`} />
                  <text x="100" y="223" textAnchor="middle" className="text-[8px] fill-stone-300 font-mono">SHELTER</text>
                </g>

                {/* Hospital Hub */}
                <g className="cursor-pointer" onClick={() => setSelectedType("Hospital")}>
                  <circle cx="400" cy="220" r="18" className={`fill-stone-950 stroke-emerald-500 ${selectedType === "Hospital" ? "stroke-2 fill-emerald-950/20" : "opacity-70"}`} />
                  <text x="400" y="223" textAnchor="middle" className="text-[8px] fill-stone-300 font-mono">MED</text>
                </g>

                {/* CWC Hub */}
                <g className="cursor-pointer" onClick={() => setSelectedType("CWC")}>
                  <circle cx="250" cy="50" r="18" className={`fill-stone-950 stroke-emerald-500 ${selectedType === "CWC" ? "stroke-2 fill-emerald-950/20" : "opacity-70"}`} />
                  <text x="250" y="53" textAnchor="middle" className="text-[8px] fill-stone-300 font-mono">CWC</text>
                </g>
              </svg>
            </div>

            {/* Operational connection state */}
            <div className="bg-stone-950 p-3 rounded-xl border border-stone-850 flex items-center justify-between text-[10px] font-mono">
              <span className="text-stone-500">ACTIVE INTEGRATION: <span className="text-white font-bold">{selectedType.toUpperCase()} HUB</span></span>
              <span className="text-emerald-400 font-bold uppercase flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 animate-pulse" /> Nodes Synchronized
              </span>
            </div>

          </div>
        </div>

        {/* Right Panel: Performance and Compliance scores */}
        <div className="lg:col-span-3 space-y-4">
          <div className={`p-4 rounded-2xl border ${bgCard} shadow-xl space-y-4 h-[440px] overflow-y-auto`}>
            
            <div className="border-b border-stone-850 pb-3">
              <h3 className="font-black text-xs uppercase tracking-widest text-emerald-400 font-mono flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                Integration Specs
              </h3>
              <p className="text-[10px] text-stone-500 mt-1 uppercase">Active node telemetry metrics</p>
            </div>

            {/* Performance specification cards */}
            <div className="space-y-4 text-xs font-mono">
              
              <div className="p-3 bg-stone-950 rounded-xl border border-stone-900">
                <span className="text-[9px] text-stone-500 uppercase block font-bold">Active Cases Handled</span>
                <span className="text-xl font-black text-emerald-400">{totalCasesCategory || 210} Cases</span>
              </div>

              <div className="p-3 bg-stone-950 rounded-xl border border-stone-900">
                <span className="text-[9px] text-stone-500 uppercase block font-bold">Assigned Personnel</span>
                <span className="text-xl font-black text-white">{totalPersonnelCategory || 42} Officers</span>
              </div>

              <div className="p-3 bg-stone-950 rounded-xl border border-stone-900">
                <span className="text-[9px] text-stone-500 uppercase block font-bold">Standard Compliance Rating</span>
                <span className="text-xl font-black text-white">99.1% Verified</span>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* Registry Table / Grid below */}
      <div className={`p-5 rounded-2xl border ${bgCard} shadow-xl space-y-4`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="font-black text-xs uppercase tracking-widest text-emerald-400 font-mono">
              INSTITUTIONAL MEMBER ROSTER
            </h3>
            <p className="text-[10px] text-stone-500 uppercase mt-0.5">Authorised child rescue departments synced with Rakshak core</p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
            <input 
              type="text" 
              placeholder="Search department, state..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-xs rounded bg-stone-950 border border-stone-850 text-white focus:outline-none placeholder-stone-600"
            />
          </div>
        </div>

        {/* Organizations Table list */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-stone-850 text-stone-500 font-bold uppercase text-[9px] bg-stone-950 p-2">
                <th className="p-3">Org ID</th>
                <th className="p-3">Institution / Unit</th>
                <th className="p-3">Type</th>
                <th className="p-3">State Domain</th>
                <th className="p-3">Active Personnel</th>
                <th className="p-3 text-center">Compliance Rating</th>
                <th className="p-3 text-right">Operational Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrgs.map((org) => (
                <tr key={org.id} className="border-b border-stone-900 hover:bg-stone-950/40 transition-colors">
                  <td className="p-3 font-bold text-stone-400">{org.id}</td>
                  <td className="p-3 font-bold text-white">{org.name}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-stone-900 text-stone-300 rounded border border-stone-850 text-[10px] font-bold">
                      {org.type}
                    </span>
                  </td>
                  <td className="p-3 text-stone-300">{org.state}</td>
                  <td className="p-3 text-stone-350">{org.personnel} Active</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">{org.compliance}</td>
                  <td className="p-3 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      org.status === "Verified" 
                        ? "bg-emerald-950/50 text-emerald-400 border border-emerald-900/50" 
                        : "bg-amber-950/50 text-amber-400 border border-amber-900/50"
                    }`}>
                      {org.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl relative ${bgCard}`}>
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-850 transition-colors text-stone-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-sm font-black tracking-widest uppercase mb-4 text-emerald-400 font-mono">
              Register New Collaboration Node
            </h3>

            <form onSubmit={handleCreateOrg} className="space-y-4">
              <div>
                <label className="block text-[9px] font-bold text-stone-500 uppercase mb-1 font-mono">Institution Name</label>
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  placeholder="e.g. Pune Child Welfare Division"
                  className="w-full p-2.5 text-xs rounded-lg border border-stone-850 bg-stone-950 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-stone-500 uppercase mb-1 font-mono">Node Type</label>
                <select 
                  value={newType} 
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full p-2.5 text-xs rounded-lg border border-stone-850 bg-stone-950 text-white focus:outline-none font-mono"
                >
                  <option value="Police">Police</option>
                  <option value="NGO">NGO</option>
                  <option value="Shelter">Shelter</option>
                  <option value="Hospital">Hospital</option>
                  <option value="CWC">CWC</option>
                  <option value="Government Agency">Government Agency</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-stone-500 uppercase mb-1 font-mono">State Domain</label>
                  <input 
                    type="text" 
                    value={newState} 
                    onChange={(e) => setNewState(e.target.value)}
                    required
                    placeholder="e.g. Maharashtra"
                    className="w-full p-2.5 text-xs rounded-lg border border-stone-850 bg-stone-950 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-stone-500 uppercase mb-1 font-mono">Personnel Count</label>
                  <input 
                    type="number" 
                    value={newPersonnel} 
                    onChange={(e) => setNewPersonnel(e.target.value)}
                    required
                    className="w-full p-2.5 text-xs rounded-lg border border-stone-850 bg-stone-950 text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-stone-500 uppercase mb-1 font-mono">Contact / Helpline</label>
                <input 
                  type="text" 
                  value={newContact} 
                  onChange={(e) => setNewContact(e.target.value)}
                  placeholder="e.g. +91 22 2262 0111"
                  className="w-full p-2.5 text-xs rounded-lg border border-stone-850 bg-stone-950 text-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 font-mono">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-850 hover:bg-stone-900 rounded-lg text-xs font-bold"
                >
                  CANCEL
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-mono tracking-widest"
                >
                  PROVISION NODE
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
