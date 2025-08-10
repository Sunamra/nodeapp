const fs = require('fs');
const os = require('os');
const path = require('path');
const checkDiskSpace = require('check-disk-space');
const { execSync } = require('child_process');

const router = require('express').Router();
const { getAll, getFileList, getFile } = require('../controllers');
const { logRequest } = require('../middleware');

router.route('/').get(logRequest, getFileList);
router.route('/:file').get(logRequest, getFile);


// Temporary, not part of the project
router.route('/redirect/videotools').get((_, res) => {
	res.redirect('https://www.dropbox.com/scl/fi/8x9gn69ja0ah4lsv37rct/VideoTools.zip?rlkey=gi7bubvd8aapjue6g8togy6he');
});

// Helper: push a debug entry
function pushDebug(arr, step, ok, details, data) {
	const e = { step, ok: !!ok, details: details || '' };
	if (data !== undefined) e.data = data;
	arr.push(e);
}

function truncate(s, n = 2000) {
	if (s === undefined || s === null) return '';
	s = String(s);
	if (s.length > n) return s.slice(0, n) + '... (truncated)';
	return s;
}

router.route('/details/storage').get(async (_, res) => {
	const debug = [];
	pushDebug(debug, 'start', true, 'handler invoked', { ts: new Date().toISOString() });

	const platform = os.platform();
	pushDebug(debug, 'detect-platform', true, `platform=${platform}`);

	let candidates = [];

	if (platform === 'win32') {
		pushDebug(debug, 'windows', true, 'running Windows-specific detection (wmic)');
		try {
			const out = execSync('wmic logicaldisk get name', { encoding: 'utf8' });
			pushDebug(debug, 'wmic-output', true, 'raw wmic output', truncate(out));
			candidates = out.split(/\r?\n/).map(l => l.trim()).filter(Boolean).filter(l => /^[A-Z]:$/i.test(l)).map(l => l + '\\\\');
			pushDebug(debug, 'wmic-parsed', true, `parsed ${candidates.length} drives`, candidates.slice(0, 50));
		} catch (err) {
			pushDebug(debug, 'wmic-fail', false, 'wmic detection failed', err.message || String(err));
			// fallback common drive
			candidates = ['C:\\'];
		}
	} else {
		// Try reading /proc/mounts (works on most Linux hosts incl. containers on Render)
		pushDebug(debug, 'unix', true, 'attempting /proc/mounts');
		try {
			const mountsRaw = fs.readFileSync('/proc/mounts', 'utf8');
			pushDebug(debug, 'proc-mounts-raw', true, 'read /proc/mounts', truncate(mountsRaw));
			const lines = mountsRaw.split(/\r?\n/).filter(Boolean);
			const blacklist = new Set([
				'proc', 'sysfs', 'tmpfs', 'devpts', 'devtmpfs', 'securityfs', 'cgroup', 'cgroup2', 'pstore',
				'autofs', 'overlay', 'tracefs', 'debugfs', 'hugetlbfs', 'rpc_pipefs', 'mqueue', 'fusectl', 'configfs'
			]);
			for (const line of lines) {
				const parts = line.split(' ');
				if (parts.length < 3) continue;
				const device = parts[0];
				const mnt = parts[1];
				const fstype = parts[2];
				if (!mnt || !mnt.startsWith('/')) continue;
				if (blacklist.has(fstype)) continue; // skip pseudo fs types
				candidates.push(mnt);
			}
			candidates = [...new Set(candidates)];
			pushDebug(debug, 'proc-mounts-parsed', true, `found ${candidates.length} mount points`, candidates.slice(0, 100));
		} catch (err) {
			pushDebug(debug, 'proc-mounts-fail', false, 'reading /proc/mounts failed', err.message || String(err));
		}

		// Fallback: try df -P to extract mount points (POSIX output)
		if (candidates.length === 0) {
			pushDebug(debug, 'df-fallback', true, 'attempting `df -P`');
			try {
				const out = execSync('df -P', { encoding: 'utf8' });
				pushDebug(debug, 'df-raw', true, 'raw df output', truncate(out));
				const lines = out.split(/\r?\n/).slice(1).filter(Boolean);
				for (const l of lines) {
					const parts = l.trim().split(/\s+/);
					const mnt = parts[parts.length - 1];
					if (mnt && mnt.startsWith('/')) candidates.push(mnt);
				}
				candidates = [...new Set(candidates)];
				pushDebug(debug, 'df-parsed', true, `found ${candidates.length} mount points from df`, candidates.slice(0, 100));
			} catch (err) {
				pushDebug(debug, 'df-fail', false, 'df fallback failed', err.message || String(err));
			}
		}

		// Final fallback: list top-level directories under '/'
		if (candidates.length === 0) {
			pushDebug(debug, 'ls-root-fallback', true, 'falling back to listing / top-level directories');
			try {
				const dirents = fs.readdirSync('/', { withFileTypes: true });
				let topDirs = dirents.filter(d => d.isDirectory()).map(d => path.join('/', d.name));
				topDirs.unshift('/');
				topDirs = [...new Set(topDirs)];
				candidates = topDirs;
				pushDebug(debug, 'ls-root-parsed', true, `found ${candidates.length} top-level directories`, candidates.slice(0, 100));
			} catch (err) {
				pushDebug(debug, 'ls-root-fail', false, 'listing / failed', err.message || String(err));
			}
		}
	}

	// Ensure '/' is present and deduplicate
	if (!candidates.includes('/')) candidates.unshift('/');
	candidates = [...new Set(candidates)];
	pushDebug(debug, 'summary-candidates', true, `final candidate list length=${candidates.length}`, candidates.slice(0, 200));

	// For each candidate, attempt to read disk space. Collect both successes and failures.
	const roots = [];
	for (const c of candidates) {
		const item = { path: c };
		try {
			pushDebug(debug, 'check-start', true, `checking disk space for ${c}`);
			const space = await checkDiskSpace(c);
			item.total = space.size;
			item.free = space.free;
			item.unit = 'bytes';
			pushDebug(debug, 'check-success', true, `got space for ${c}`, { total: space.size, free: space.free });
		} catch (err) {
			item.error = String(err && err.message ? err.message : err);
			pushDebug(debug, 'check-fail', false, `checkDiskSpace failed for ${c}`, item.error);
		}
		roots.push(item);
	}

	const result = { roots, debug };
	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify(result, null, 2));
}
);

module.exports = router;