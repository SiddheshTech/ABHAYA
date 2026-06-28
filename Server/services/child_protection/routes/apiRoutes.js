const express = require('express');
const router = express.Router();

const Child = require('../models/Child');
const Shelter = require('../models/Shelter');
const FamilyMatch = require('../models/FamilyMatch');
const WellnessRecord = require('../models/WellnessRecord');
const JourneyMilestone = require('../models/JourneyMilestone');
const Campaign = require('../models/Campaign');
const ImpactStory = require('../models/ImpactStory');

// Dashboard Routes
router.get('/dashboard', (req, res) => res.json({ status: 'ok' }));

// Campaigns
router.get('/campaigns', async (req, res) => {
    try {
        const campaigns = await Campaign.find();
        res.json(campaigns);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Impact Stories
router.get('/impact-stories', async (req, res) => {
    try {
        const stories = await ImpactStory.find();
        res.json(stories);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Stats
router.get('/stats', async (req, res) => {
    try {
        const totalChildren = await Child.countDocuments();
        const familyMatches = await FamilyMatch.countDocuments({ status: 'Approved' });
        
        const priorityQueue = [
            { label: "New Rescues", count: await Child.countDocuments({ status: "Rescued" }), type: "emerald" },
            { label: "Medical Priority", count: await WellnessRecord.countDocuments({ medicalAlerts: { $exists: true, $not: {$size: 0} } }), type: "red" },
            { label: "Awaiting Verification", count: await Child.countDocuments({ status: "Recovering" }), type: "yellow" },
            { label: "Pending Family Match", count: await FamilyMatch.countDocuments({ status: "Pending Verification" }), type: "blue" },
        ];

        const recoveryPipeline = [
            { stage: "Rescued", active: true, count: await Child.countDocuments({ status: "Rescued" }) },
            { stage: "Recovering", active: true, count: await Child.countDocuments({ status: "Recovering" }) },
            { stage: "Verified", active: true, count: await Child.countDocuments({ status: "Verified" }) },
            { stage: "Family Matched", active: false, count: await FamilyMatch.countDocuments({ status: "Approved" }) },
            { stage: "Reintegrated", active: false, count: await Child.countDocuments({ status: "Reintegrated" }) },
        ];

        const schedule = [
            { label: "Upcoming Counselling", time: "10:00 AM", iconName: "Heart" },
            { label: "Family Interviews", time: "11:30 AM", iconName: "Users" },
            { label: "Health Reviews", time: "02:00 PM", iconName: "Activity" },
            { label: "AI Welfare Alerts", time: "04:15 PM", iconName: "Shield" },
        ];

        const dailyBrief = [
            { value: (await Child.countDocuments({ status: "Reintegrated" })).toString(), label: "Rehabilitated" },
            { value: (await FamilyMatch.countDocuments({ status: "Approved" })).toString(), label: "Matches Found" },
            { value: (await Child.countDocuments({ riskLevel: "High Risk" })).toString(), label: "Escalations" },
            { value: (await WellnessRecord.countDocuments()).toString(), label: "Sessions" },
        ];

        res.json({
            totalChildren,
            newRescues: await Child.countDocuments({ status: "Rescued" }),
            familyMatches,
            medicalCases: await WellnessRecord.countDocuments({ medicalAlerts: { $exists: true, $not: {$size: 0} } }),
            successRate: 85,
            urgentCases: await Child.countDocuments({ riskLevel: 'High Risk' }),
            priorityQueue,
            recoveryPipeline,
            schedule,
            dailyBrief
        });
    } catch(err) {
        res.status(500).json({error: err.message});
    }
});

// Child Routes
router.get('/children', async (req, res) => {
    try {
        const children = await Child.find({});
        res.json(children);
    } catch(err) { res.status(500).json({error: err.message}); }
});

router.put('/children/:id', async (req, res) => {
    try {
        const child = await Child.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        req.io.emit('update', { type: 'children', data: await Child.find({}) });
        res.json(child);
    } catch(err) { res.status(500).json({error: err.message}); }
});

// Shelter Routes
router.get('/shelters', async (req, res) => {
    try {
        const shelters = await Shelter.find({});
        res.json(shelters);
    } catch(err) { res.status(500).json({error: err.message}); }
});

// Family Match Routes
router.get('/family-matches', async (req, res) => {
    try {
        const matches = await FamilyMatch.find({});
        res.json(matches);
    } catch(err) { res.status(500).json({error: err.message}); }
});

router.put('/family-matches/:id', async (req, res) => {
    try {
        const match = await FamilyMatch.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        req.io.emit('update', { type: 'family-matches', data: await FamilyMatch.find({}) });
        res.json(match);
    } catch(err) { res.status(500).json({error: err.message}); }
});

// Wellness Routes
router.get('/wellness', async (req, res) => {
    try {
        const records = await WellnessRecord.find({});
        res.json(records);
    } catch(err) { res.status(500).json({error: err.message}); }
});

router.put('/wellness/:id', async (req, res) => {
    try {
        const record = await WellnessRecord.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        req.io.emit('update', { type: 'wellness', data: await WellnessRecord.find({}) });
        res.json(record);
    } catch(err) { res.status(500).json({error: err.message}); }
});

// Journey Routes
router.get('/journeys', async (req, res) => {
    try {
        const journeys = await JourneyMilestone.find({});
        res.json(journeys);
    } catch(err) { res.status(500).json({error: err.message}); }
});

router.put('/journeys/:id', async (req, res) => {
    try {
        const journey = await JourneyMilestone.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        req.io.emit('update', { type: 'journeys', data: await JourneyMilestone.find({}) });
        res.json(journey);
    } catch(err) { res.status(500).json({error: err.message}); }
});

module.exports = router;
