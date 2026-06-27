const express = require('express');
const router = express.Router();
const KnowledgeNode = require('../models/KnowledgeNode');
const KnowledgeEdge = require('../models/KnowledgeEdge');
const RecentIntel = require('../models/RecentIntel');
const SavedReport = require('../models/SavedReport');
const FavoriteCase = require('../models/FavoriteCase');
const Watchlist = require('../models/Watchlist');
const AISuggestion = require('../models/AISuggestion');

router.get('/stats', async (req, res) => {
    try {
        const stats = {
            totalRecords: 1205400,
            activeCases: 8402,
            closedCases: 1530,
            archivedCases: 10400,
            indexedProfiles: 45910,
            evidenceFiles: 14200,
            videos: 2100,
            images: 8400,
            audioFiles: 1100,
            dnaRecords: 3400,
            fingerprints: 8900,
            faceProfiles: 12500,
            activeUsers: 84,
            connectedAgencies: ["NCB", "CBI", "NIA", "CyberCell"],
            apiHealth: "Optimal",
            serverStatus: "Online",
            storageUsage: "45.2 TB",
            latency: 14,
            lastSync: new Date().toISOString()
        };
        res.json(stats);
    } catch(err) { res.status(500).json({error: err.message}); }
});

router.get('/recent', async (req, res) => {
    try {
        const items = await RecentIntel.find().sort({ createdAt: -1 });
        res.json(items);
    } catch(err) { res.status(500).json({error: err.message}); }
});

router.get('/reports', async (req, res) => {
    try {
        const items = await SavedReport.find().sort({ createdAt: -1 });
        res.json(items);
    } catch(err) { res.status(500).json({error: err.message}); }
});

router.get('/favorites', async (req, res) => {
    try {
        const items = await FavoriteCase.find().sort({ createdAt: -1 });
        res.json(items);
    } catch(err) { res.status(500).json({error: err.message}); }
});

router.get('/watchlist', async (req, res) => {
    try {
        const items = await Watchlist.find().sort({ createdAt: -1 });
        res.json(items);
    } catch(err) { res.status(500).json({error: err.message}); }
});

router.get('/suggestions', async (req, res) => {
    try {
        const items = await AISuggestion.find().sort({ createdAt: -1 });
        res.json(items);
    } catch(err) { res.status(500).json({error: err.message}); }
});

router.get('/graph', async (req, res) => {
    try {
        const nodes = await KnowledgeNode.find();
        const edges = await KnowledgeEdge.find();
        res.json({ nodes, edges });
    } catch(err) { res.status(500).json({error: err.message}); }
});

router.get('/related/:id', async (req, res) => {
    try {
        // Return mock related records just for the graph node
        res.json([{
            id: `REL-${Date.now()}`,
            targetId: req.params.id,
            targetName: "Network Node",
            type: "Shared Financials",
            similarity: 88,
            confidence: 90,
            sharedAttributes: ["Hawala", "Location"],
            lastActivity: new Date().toISOString()
        }]);
    } catch(err) { res.status(500).json({error: err.message}); }
});

router.get('/search', async (req, res) => {
    try {
        const q = req.query.q || "";
        res.json([]); // Just empty for now to satisfy component loading
    } catch(err) { res.status(500).json({error: err.message}); }
});

router.post('/recent/:id/bookmark', async (req, res) => {
    try {
        const item = await RecentIntel.findOne({ id: req.params.id });
        if (item) {
            item.bookmarked = !item.bookmarked;
            await item.save();
            req.io.emit('update', { type: 'knowledge_recent', data: await RecentIntel.find().sort({ createdAt: -1 }) });
        }
        res.json({ success: true });
    } catch(err) { res.status(500).json({error: err.message}); }
});

router.post('/recent/:id/status', async (req, res) => {
    try {
        await RecentIntel.findOneAndUpdate({ id: req.params.id }, { status: req.body.status });
        req.io.emit('update', { type: 'knowledge_recent', data: await RecentIntel.find().sort({ createdAt: -1 }) });
        res.json({ success: true });
    } catch(err) { res.status(500).json({error: err.message}); }
});

router.post('/reports', async (req, res) => {
    try {
        const { title, type, content, tags } = req.body;
        const newReport = new SavedReport({
            id: `REP-${Math.floor(Math.random() * 10000)}`,
            title, type, content, tags,
            author: "Dr. Smith Kadam",
            date: new Date().toISOString().split('T')[0],
            size: "1.2 MB",
            status: "Draft"
        });
        await newReport.save();
        req.io.emit('update', { type: 'knowledge_reports', data: await SavedReport.find().sort({ createdAt: -1 }) });
        res.json(newReport);
    } catch(err) { res.status(500).json({error: err.message}); }
});

router.post('/reports/:id/sign', async (req, res) => {
    try {
        const item = await SavedReport.findOne({ id: req.params.id });
        if (item) {
            item.signature = { signedBy: req.body.signedBy, timestamp: new Date().toISOString(), hash: "A3F9B..." };
            item.status = "Signed";
            await item.save();
            req.io.emit('update', { type: 'knowledge_reports', data: await SavedReport.find().sort({ createdAt: -1 }) });
            res.json(item);
        } else res.status(404).json({ error: "Not found" });
    } catch(err) { res.status(500).json({error: err.message}); }
});

router.post('/reports/:id/approve', async (req, res) => {
    try {
        const item = await SavedReport.findOne({ id: req.params.id });
        if (item) {
            item.status = "Approved";
            await item.save();
            req.io.emit('update', { type: 'knowledge_reports', data: await SavedReport.find().sort({ createdAt: -1 }) });
            res.json(item);
        } else res.status(404).json({ error: "Not found" });
    } catch(err) { res.status(500).json({error: err.message}); }
});

router.post('/reports/:id/save', async (req, res) => {
    try {
        const item = await SavedReport.findOne({ id: req.params.id });
        if (item) {
            item.content = req.body.content;
            item.version += 1;
            item.versionHistory.push({ version: item.version, date: new Date().toISOString(), author: item.author, changes: "Autosaved edit" });
            await item.save();
            req.io.emit('update', { type: 'knowledge_reports', data: await SavedReport.find().sort({ createdAt: -1 }) });
            res.json(item);
        } else res.status(404).json({ error: "Not found" });
    } catch(err) { res.status(500).json({error: err.message}); }
});

router.post('/favorites/:id/notes', async (req, res) => {
    try {
        await FavoriteCase.findOneAndUpdate({ id: req.params.id }, { personalNotes: req.body.personalNotes });
        req.io.emit('update', { type: 'knowledge_favorites', data: await FavoriteCase.find().sort({ createdAt: -1 }) });
        res.json({ success: true });
    } catch(err) { res.status(500).json({error: err.message}); }
});

router.post('/favorites/:id/reminder', async (req, res) => {
    try {
        await FavoriteCase.findOneAndUpdate({ id: req.params.id }, { reminderDate: req.body.reminderDate });
        req.io.emit('update', { type: 'knowledge_favorites', data: await FavoriteCase.find().sort({ createdAt: -1 }) });
        res.json({ success: true });
    } catch(err) { res.status(500).json({error: err.message}); }
});

router.post('/watchlist', async (req, res) => {
    try {
        const { type, value, tags, riskScore } = req.body;
        const newItem = new Watchlist({
            id: `WATCH-${Math.floor(Math.random() * 10000)}`,
            type, value, tags, riskScore,
            status: "MONITORING",
            addedDate: new Date().toISOString().split('T')[0]
        });
        await newItem.save();
        req.io.emit('update', { type: 'knowledge_watchlist', data: await Watchlist.find().sort({ createdAt: -1 }) });
        res.json(newItem);
    } catch(err) { res.status(500).json({error: err.message}); }
});

router.post('/watchlist/:id/trigger', async (req, res) => {
    try {
        const item = await Watchlist.findOne({ id: req.params.id });
        if (item) {
            item.alertCount += 1;
            item.status = "TRIGGERED";
            item.lastMatch = new Date().toISOString();
            await item.save();
            req.io.emit('update', { type: 'knowledge_watchlist', data: await Watchlist.find().sort({ createdAt: -1 }) });
            req.io.emit('knowledge_alert', { message: `Watchlist Trigger: ${item.type} ${item.value}`, data: item });
            res.json(item);
        } else res.status(404).json({ error: "Not found" });
    } catch(err) { res.status(500).json({error: err.message}); }
});

module.exports = router;
