const fs = require('fs');

const dbPath = '/Users/flavien/Documents/DEV/Visuals.co/client/src/data/database.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const reliableImages = {
    fashion: [
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&auto=format&fit=crop"
    ],
    architecture: [
        "https://images.unsplash.com/photo-1600596542815-60002041dd81?w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600607687920-4e2a09be15ea?w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600566753086-00f18efc2291?w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop"
    ]
};

let fIdx = 0;
let aIdx = 0;

db.projects.forEach(project => {
    if (project.client === 'Maison Éclat' || project.client === 'Vogue Paris') {
        project.thumbnail = reliableImages.fashion[fIdx % reliableImages.fashion.length];
        fIdx++;
    } else {
        project.thumbnail = reliableImages.architecture[aIdx % reliableImages.architecture.length];
        aIdx++;
    }

    if (project.assets && project.assets.length > 0) {
        project.assets.forEach(asset => {
            if (asset.versions && asset.versions.length > 0) {
                asset.versions.forEach(v => {
                    if (project.client === 'Maison Éclat' || project.client === 'Vogue Paris') {
                        v.url = reliableImages.fashion[Math.floor(Math.random() * reliableImages.fashion.length)];
                    } else {
                        v.url = reliableImages.architecture[Math.floor(Math.random() * reliableImages.architecture.length)];
                    }
                });
            }
        });
    }
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 4));
console.log('Database updated successfully');
