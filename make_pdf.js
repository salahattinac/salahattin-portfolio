const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');

const edgeExe = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outPdf = path.join(__dirname, 'assets', 'cv', 'salahattin-acikgoz-cv.pdf');
const targetUrl = 'http://localhost:3000/cv.html';
const tempUserData = path.join(process.env.TEMP || 'C:\\Temp', 'edge_pdf_profile_' + Date.now());

const args = [
    '--headless',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + tempUserData,
    '--print-to-pdf=' + outPdf,
    '--no-pdf-header-footer',
    targetUrl
];

console.log('Generating PDF...');
execFile(edgeExe, args, (err, stdout, stderr) => {
    if (err) console.error('Exec error:', err.message);
    setTimeout(() => {
        const exists = fs.existsSync(outPdf);
        console.log('PDF exists:', exists);
        if (exists) {
            console.log('File size:', fs.statSync(outPdf).size, 'bytes');
        }
    }, 2000);
});
