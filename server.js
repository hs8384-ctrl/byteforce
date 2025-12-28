const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Market Intelligence Data
const skillsDatabase = {
    "frontend-developer": { "React": 90, "TypeScript": 85, "System Design": 80 },
    "data-scientist": { "Python": 95, "Machine Learning": 90, "Cloud": 80 }
};

const courses = [
    { skill: "System Design", title: "Distributed Systems Architecture", provider: "MIT OpenCourseWare" },
    { skill: "TypeScript", title: "FullStack TS Guide", provider: "Udemy" },
    { skill: "Machine Learning", title: "AI Foundations", provider: "Coursera" },
    { skill: "Cloud", title: "AWS Solutions Architect", provider: "Amazon" }
];

app.post('/api/analyze', (req, res) => {
    const { role, userSkills } = req.body;
    const requirements = skillsDatabase[role];
    
    const gapSummary = Object.keys(requirements).map(skill => ({
        skill: skill,
        gapValue: Math.max(0, requirements[skill] - (userSkills[skill] || 0))
    }));

    const roadmap = courses.filter(c => 
        gapSummary.some(g => g.skill === c.skill && g.gapValue > 20)
    );

    res.json({ gapSummary, roadmap });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
