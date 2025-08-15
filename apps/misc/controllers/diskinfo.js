const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function formatSizes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Display disk info or perform write tests, with optional debug output
 */
module.exports = (req, res) => {
    const query = req.query || {};

    const debugEnabled = query.debug === 'true';
    const diskWriteTest = query.diskwritetest === 'true';
    const info = query.info === 'true';
    const writeSizeMiB = query.size ? parseInt(query.size, 10) : null;

    // If no query parameters, return help message
    if (Object.keys(query).length === 0) {
        const usageText = `
Usage:
    info=true               - Get file storage info
    diskwritetest=true      - Perform disk write test (must be used with 'size')
    size=NUMBER             - Specify size of test file in MB
    debug=true (optional)   - Add this to any request to get detailed debug info

Examples:
    /api/diskinfo?info=true
    /api/diskinfo?info=true&debug=true
    /api/diskinfo?diskwritetest=true&size=100
    /api/diskinfo?diskwritetest=true&size=100&debug=true

Note:
    The 'disk write test' creates a temporary file in the current working directory and deletes it after testing.\n`;
        return res.type('text').send(usageText);
    }

    // If only debug is passed without any main parameter
    if (debugEnabled && !info && !diskWriteTest) {
        return res.type('text').status(400).send('\nUse "debug" with either info=true or diskwritetest=true.\n');
    }

    const debug = [];
    const roots = [];

    const addDebug = (step, ok, details, data) => {
        if (debugEnabled) debug.push({ step, ok, details, data });
    };

    // Disk write test logic remains same
    if (diskWriteTest) {
        if (!writeSizeMiB) {
            return res.type('text').status(400).send('\nPlease provide size in MiB using size=NUMBER when diskwritetest=true\n');
        }

        const cwd = process.cwd();
        const testFilePath = path.join(cwd, 'disk_write_test.tmp');
        addDebug('disk-write-test', true, `Starting disk write test for ${writeSizeMiB} MiB`, testFilePath.replace(/\\/g, '/'));

        let diskTestResult = null;
        try {
            const buffer = Buffer.alloc(1024 * 1024, '0'); // 1 MiB chunk
            const fd = fs.openSync(testFilePath, 'w');
            for (let i = 0; i < writeSizeMiB; i++) {
                fs.writeSync(fd, buffer);
            }
            fs.closeSync(fd);
            diskTestResult = `Successfully wrote ${writeSizeMiB} MiB to disk.`;
        } catch (err) {
            diskTestResult = err.message;
        } finally {
            try {
                if (fs.existsSync(testFilePath)) fs.unlinkSync(testFilePath);
            } catch (err) {
                diskTestResult = err.message;
            }
        }

        return res.json({
            diskTestResult,
            ...(debugEnabled ? { debug } : {})
        });
    }

    // If info requested, return filesystem info
    if (info) {
        addDebug('start', true, 'Starting disk space check');

        let mountsOutput;
        try {
            // Check if /proc/mounts exists to verify unix-like system
            if (!fs.existsSync('/proc/mounts')) {
                return res.type('text').status(501).send('\nNon-Unix filesystem detected. Operation not supported.\n');
            }
            mountsOutput = fs.readFileSync('/proc/mounts', 'utf8');
        } catch (err) {
            return res.type('text').status(501).send('\nNon-Unix filesystem detected or cannot access /proc/mounts.\n');
        }

        const lines = mountsOutput.split('\n');
        const mountPaths = [...new Set(lines.map(l => l.split(' ')[1]).filter(Boolean))];
        addDebug('mount-detection', true, 'Detected mount paths', mountPaths);

        for (const mPath of mountPaths) {
            try {
                const dfOutput = execSync(`df -B1 ${mPath} | tail -1`, { encoding: 'utf8' });
                const parts = dfOutput.trim().split(/\s+/);
                const total = parseInt(parts[1], 10);
                const free = parseInt(parts[3], 10);
                roots.push({
                    path: mPath,
                    total: formatSizes(total),
                    free: formatSizes(free)
                });
                addDebug('df-check', true, `Checked ${mPath}`, { total, free });
            } catch (err) {
                addDebug('df-check', false, `Error checking ${mPath}`, err.message);
            }
        }

        const cwd = process.cwd();

        const response = {
            roots,
            cwd,
            ...(debugEnabled ? { debug } : {})
        };

        return res.json(response);
    }

    // If none of the recognized parameters matched, return error
    return res.type('text').send('\nInvalid or missing query parameters.\nUse no parameters to get usage help.\n');
};
