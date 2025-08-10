// Install first: npm install check-disk-space
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');
let checkDiskSpace;

try {
	const mod = require('check-disk-space');
	checkDiskSpace = typeof mod === 'function' ? mod : mod.default;
} catch (err) {
	throw new Error('Failed to load check-disk-space module: ' + err.message);
}

function formatSizes(bytes) {
	return {
		bytes,
		megabytes: +(bytes / 1024 / 1024).toFixed(2),
		gigabytes: +(bytes / 1024 / 1024 / 1024).toFixed(2)
	};
}

async function diskinfo(req, res) {
	const query = req.query;
    const debugEnabled = query.debug === 'true';
    const diskWriteTest = query.diskwritetest === 'true';
    const writeSizeMiB = query.size ? parseInt(query.size, 10) : null;

    const debug = [];
    const roots = [];

    const addDebug = (step, ok, details, data) => {
        if (debugEnabled) debug.push({ step, ok, details, data });
    };

    if (diskWriteTest) {
        if (!writeSizeMiB) {
            return res.json({ error: 'Please provide size in MiB using ?size=NUMBER when diskwritetest=true' });
        }

        const cwd = process.cwd();
        const testFilePath = path.join(cwd, 'disk_write_test.tmp');
        addDebug('disk-write-test', true, `Starting disk write test for ${writeSizeMiB} MiB`, testFilePath);

        let diskTestResult = null;
        try {
            const buffer = Buffer.alloc(1024 * 1024, '0'); // 1 MiB chunk
            const fd = fs.openSync(testFilePath, 'w');
            for (let i = 0; i < writeSizeMiB; i++) {
                fs.writeSync(fd, buffer);
            }
            fs.closeSync(fd);
            diskTestResult = { success: true, message: `Successfully wrote ${writeSizeMiB} MiB to disk.` };
        } catch (err) {
            diskTestResult = { success: false, error: err.message };
        } finally {
            try {
                if (fs.existsSync(testFilePath)) fs.unlinkSync(testFilePath);
            } catch {}
        }

        return res.json({
            diskTestResult,
            ...(debugEnabled ? { debug } : {})
        });
    }

    addDebug('start', true, 'Starting disk space check');

    try {
        const mountsOutput = fs.readFileSync('/proc/mounts', 'utf8');
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
    } catch (err) {
        addDebug('mount-detection', false, 'Error reading mounts', err.message);
    }

    const cwd = process.cwd();

    const response = {
        roots,
        cwd,
        ...(debugEnabled ? { debug } : {})
    };

    res.json(response);
}

module.exports = diskinfo;
