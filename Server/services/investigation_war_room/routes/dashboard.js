const express = require('express');
const router = express.Router();

const Case = require('../models/Case');
const Lead = require('../models/Lead');
const GenomeMutation = require('../models/GenomeMutation');
const LiveTracker = require('../models/LiveTracker');

// GET /api/v1/dashboard/summary
// Returns War Room metrics and map live feeds
router.get('/summary', async (req, res) => {
  try {
    const activeCases = await Case.countDocuments({ status: 'Active' });
    const escalatedCases = await Case.countDocuments({ status: 'Escalated' });
    const childrenRescuedToday = await Case.countDocuments({ status: 'Recovered' }); 
    const openOperations = 5; 

    const trackers = await LiveTracker.find().limit(10);
    const liveFeeds = trackers.map((t, index) => {
      let color = 'blue';
      let title = 'Asset Tracking';
      let type = 'evidence';
      
      if (t.entityType === 'MissingChild') { color = 'red'; title = 'Emergency Alert'; type = 'alert'; }
      if (t.entityType === 'GroundTeam') { color = 'emerald'; title = 'Team Deployed'; type = 'success'; }
      if (t.entityType === 'DangerZone') { color = 'amber'; title = 'Sighting Received'; type = 'sighting'; }

      return {
        id: t._id,
        type,
        title,
        desc: `Tracker update for ${t.entityId}`,
        time: 'Just Now',
        color,
        lat: t.location.coordinates[1],
        lng: t.location.coordinates[0]
      };
    });

    const data = {
      metrics: {
        activeCases,
        escalatedCases,
        childrenRescuedToday,
        openOperations
      },
      priorityQueues: [
        { id: "Priority Alpha", count: Math.floor(escalatedCases * 0.4) || 0, color: "red" },
        { id: "Priority Beta", count: Math.floor(escalatedCases * 0.6) || 0, color: "amber" },
        { id: "New Cases Today", count: Math.floor(activeCases * 0.1) || 0, color: "blue" },
        { id: "Cases Awaiting Action", count: Math.floor(activeCases * 0.05) || 0, color: "gray" },
      ],
      liveFeeds
    };
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/dashboard/cases
router.get('/cases', async (req, res) => {
  try {
    const active = await Case.countDocuments({ status: 'Active' });
    const escalated = await Case.countDocuments({ status: 'Escalated' });
    const cold = await Case.countDocuments({ status: 'Cold' });
    const unassigned = await Case.countDocuments({ officerAssigned: 'Unassigned' });

    const rawCases = await Case.find().sort({ createdAt: -1 }).limit(20);
    const mappedCases = rawCases.map(c => {
      return {
        id: c.caseId,
        name: c.name,
        age: c.age,
        risk: c.riskScore,
        missingHours: c.hoursMissing,
        status: c.status === 'Active' ? 'Active Search' : c.status,
        category: c.status,
        img: c.photoUrl || "https://images.unsplash.com/photo-1503919004481-3069b1479d2b?auto=format&fit=crop&w=150&q=80",
        focus: {
          officer: c.officerAssigned,
          dept: "State Police",
          activity: c.mostRecentLead,
          lastSeen: c.lastSeenLocation,
          date: c.createdAt ? c.createdAt.toLocaleString() : "Recently",
          leadType: "Latest Update",
          leadDesc: c.mostRecentLead,
          timeline: c.timeline.map(t => ({ event: t.event, active: true }))
        }
      };
    });

    const data = {
      categories: [
        { label: "Active", count: active, color: "emerald" },
        { label: "Escalated", count: escalated, color: "red" },
        { label: "Cold Cases", count: cold, color: "gray" },
        { label: "Unassigned Cases", count: unassigned, color: "amber" }
      ],
      cases: mappedCases
    };
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/dashboard/genome
router.get('/genome', async (req, res) => {
  try {
    const networks = await GenomeMutation.find().limit(10);
    
    const emergingNetworks = [];
    const highActivityNetworks = [];
    
    networks.forEach(n => {
      const mapped = {
        id: n.networkId,
        name: `Network ${n.networkId}`,
        metrics: {
          kingpin: n.metrics.kingpinDetected ? 90 : 50,
          strength: n.metrics.networkStrength,
          collapse: n.metrics.collapsePointProbability,
          mutation: n.metrics.mutationRisk
        },
        summary: {
          target: `Network ${n.networkId}`,
          expansion: n.forecast.predictedExpansionArea,
          route: n.forecast.expectedShiftRoute,
          risk: n.status === 'Emerging' ? 'MEDIUM' : 'CRITICAL'
        }
      };
      if (n.status === 'Emerging') emergingNetworks.push(mapped);
      else highActivityNetworks.push(mapped);
    });

    const suspects = [
      { id: 's1', name: 'Suspect Alpha', type: 'Suspect' },
      { id: 's2', name: 'Suspect Beta', type: 'Suspect' }
    ];

    res.json({ emergingNetworks, highActivityNetworks, suspects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/dashboard/leads
router.get('/leads', async (req, res) => {
  try {
    const rawLeads = await Lead.find().sort({ createdAt: -1 }).limit(20);
    
    const mappedLeads = rawLeads.map(l => {
      return {
        id: l._id,
        type: l.type,
        status: l.status,
        title: `${l.type} Received`,
        source: 'Citizen App',
        time: 'Recently',
        location: l.location,
        distance: l.distanceFromLastSeenKm ? `${l.distanceFromLastSeenKm} km` : 'Unknown',
        linkedCase: l.linkedCaseId || 'Unassigned',
        confidence: l.confidence,
        priority: l.confidence > 80 ? 'Critical' : l.confidence > 50 ? 'High' : 'Medium',
        assignedOfficer: 'Pending',
        desc: l.aiRecommendation?.reasoning || 'No AI reasoning available.'
      };
    });

    res.json({ leads: mappedLeads });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
