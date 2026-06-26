import fs from 'fs';

let content = fs.readFileSync('src/components/InteractiveSections.tsx', 'utf-8');

// remove lines with specific content
const lines = content.split('\n');
const newLines = [];
let skip = false;
let checkSkip = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (line.includes('// Adoptive Parents Eligibility State')) {
    skip = true;
  }
  if (skip && line.includes('// Grievance filing state')) {
    skip = false;
  }

  if (line.includes('// Handle Eligibility Check')) {
    checkSkip = true;
  }
  if (checkSkip && line.includes('// Handle Grievance File Submit')) {
    checkSkip = false;
  }

  if (!skip && !checkSkip) {
    newLines.push(line);
  }
}

// now regex out the PAPs block
const joined = newLines.join('\n');
const startPhrase = "{/* 3. PAPS VIEW & CONSTRAINTS */}";
const endPhrase = "{/* 4. GUIDELINES VIEW */}";

const startIdx = joined.indexOf(startPhrase);
const endIdx = joined.indexOf(endPhrase);

if (startIdx !== -1 && endIdx !== -1) {
  const before = joined.substring(0, startIdx);
  const after = joined.substring(endIdx);
  
  // Find the `{/* ========================================== */}` before `startIdx`
  const lastSectionBreak = before.lastIndexOf("{/* ========================================== */}");
  
  const finalContent = before.substring(0, lastSectionBreak !== -1 ? lastSectionBreak : startIdx - 100) +
`{/* ========================================== */}
      {/* 3. PAPS VIEW & CONSTRAINTS */}
      {/* ========================================== */}
      {activeTab === PortalActiveTab.PAPS && (
        <PapsSection lang={lang} highContrast={highContrast} setActiveTab={setActiveTab} />
      )}

      {/* ========================================== */}
      ` + after;

  fs.writeFileSync('src/components/InteractiveSections.tsx', finalContent);
  console.log("updated InteractiveSections.tsx completely!");
} else {
  console.log("could not find phrases", startIdx, endIdx);
}
