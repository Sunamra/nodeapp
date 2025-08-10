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

function formatSizes(bytes) {
	return {
		bytes,
		megabytes: +(bytes / 1024 / 1024).toFixed(2),
		gigabytes: +(bytes / 1024 / 1024 / 1024).toFixed(2)
	};
}

async function diskinfo(req, res) {
	const url = new URL(req.url, `http://${req.headers.host}`);
	const wantDebug = url.searchParams.get('debug') === 'true';
	const wantDiskWriteTest = url.searchParams.get('diskwritetest') === 'true';

	const debug = [];
	if (wantDebug) pushDebug(debug, 'start', true, 'handler invoked', { ts: new Date().toISOString() });

	const platform = os.platform();
	if (wantDebug) pushDebug(debug, 'detect-platform', true, `platform=${platform}`);

	let candidates = [];

	if (platform === 'win32') {
		if (wantDebug) pushDebug(debug, 'windows', true, 'running Windows-specific detection (wmic)');
		try {
			const out = execSync('wmic logicaldisk get name', { encoding: 'utf8' });
			if (wantDebug) pushDebug(debug, 'wmic-output', true, 'raw wmic output', truncate(out));
			candidates = out.split(/\r?\n/).map(l => l.trim()).filter(Boolean).filter(l => /^[A-Z]:$/i.test(l)).map(l => l + '\\');
			if (wantDebug) pushDebug(debug, 'wmic-parsed', true, `parsed ${candidates.length} drives`, candidates);
		} catch (err) {
			if (wantDebug) pushDebug(debug, 'wmic-fail', false, 'wmic detection failed', err.message || String(err));
			candidates = ['C:\\'];
		}
	} else {
		if (wantDebug) pushDebug(debug, 'unix', true, 'attempting /proc/mounts');
		try {
			const mountsRaw = fs.readFileSync('/proc/mounts', 'utf8');
			if (wantDebug) pushDebug(debug, 'proc-mounts-raw', true, 'read /proc/mounts', truncate(mountsRaw));
			const lines = mountsRaw.split(/\r?\n/).filter(Boolean);
			const blacklist = new Set([
				'proc', 'sysfs', 'tmpfs', 'devpts', 'devtmpfs', 'securityfs', 'cgroup', 'cgroup2', 'pstore',
				'autofs', 'overlay', 'tracefs', 'debugfs', 'hugetlbfs', 'rpc_pipefs', 'mqueue', 'fusectl', 'configfs'
			]);
			for (const line of lines) {
				const parts = line.split(' ');
				if (parts.length < 3) continue;
				const mnt = parts[1];
				const fstype = parts[2];
				if (!mnt || !mnt.startsWith('/')) continue;
				if (blacklist.has(fstype)) continue;
				candidates.push(mnt);
			}
			candidates = [...new Set(candidates)];
			if (wantDebug) pushDebug(debug, 'proc-mounts-parsed', true, `found ${candidates.length} mount points`, candidates);
		} catch (err) {
			if (wantDebug) pushDebug(debug, 'proc-mounts-fail', false, 'reading /proc/mounts failed', err.message || String(err));
		}

		if (candidates.length === 0) {
			if (wantDebug) pushDebug(debug, 'df-fallback', true, 'attempting `df -P`');
			try {
				const out = execSync('df -P', { encoding: 'utf8' });
				if (wantDebug) pushDebug(debug, 'df-raw', true, 'raw df output', truncate(out));
				const lines = out.split(/\r?\n/).slice(1).filter(Boolean);
				for (const l of lines) {
					const parts = l.trim().split(/\s+/);
					const mnt = parts[parts.length - 1];
					if (mnt && mnt.startsWith('/')) candidates.push(mnt);
				}
				candidates = [...new Set(candidates)];
				if (wantDebug) pushDebug(debug, 'df-parsed', true, `found ${candidates.length} mount points from df`, candidates);
			} catch (err) {
				if (wantDebug) pushDebug(debug, 'df-fail', false, 'df fallback failed', err.message || String(err));
			}
		}

		if (candidates.length === 0) {
			if (wantDebug) pushDebug(debug, 'ls-root-fallback', true, 'listing / top-level directories');
			try {
				const dirents = fs.readdirSync('/', { withFileTypes: true });
				let topDirs = dirents.filter(d => d.isDirectory()).map(d => path.join('/', d.name));
				topDirs.unshift('/');
				candidates = [...new Set(topDirs)];
				if (wantDebug) pushDebug(debug, 'ls-root-parsed', true, `found ${candidates.length} top-level directories`, candidates);
			} catch (err) {
				if (wantDebug) pushDebug(debug, 'ls-root-fail', false, 'listing / failed', err.message || String(err));
			}
		}
	}

	if (!candidates.includes('/')) candidates.unshift('/');
	candidates = [...new Set(candidates)];
	if (wantDebug) pushDebug(debug, 'summary-candidates', true, `final candidate list length=${candidates.length}`, candidates);

	const roots = [];
	for (const c of candidates) {
		const item = { path: c };
		try {
			if (wantDebug) pushDebug(debug, 'check-start', true, `checking disk space for ${c}`);
			const space = await checkDiskSpace(c);
			item.total = formatSizes(space.size);
			item.free = formatSizes(space.free);
			if (wantDebug) pushDebug(debug, 'check-success', true, `got space for ${c}`, item);
		} catch (err) {
			item.error = String(err && err.message ? err.message : err);
			if (wantDebug) pushDebug(debug, 'check-fail', false, `checkDiskSpace failed for ${c}`, item.error);
		}
		roots.push(item);
	}

	const appPath = process.cwd();

	const result = { appPath, roots };

	if (wantDiskWriteTest) {
		const testFilePath = path.join(appPath, 'disk_write_test.tmp');
		let writeStatus = { path: testFilePath, writtenBytes: 0, status: 'started' };
		try {
			const stream = fs.createWriteStream(testFilePath);
			const chunk = Buffer.alloc(1024 * 1024, '0'); // 1 MB chunk
			while (true) {
				stream.write(chunk);
				writeStatus.writtenBytes += chunk.length;
			}
		} catch (err) {
			writeStatus.status = 'error';
			writeStatus.error = err.message || String(err);
		} finally {
			try {
				fs.unlinkSync(testFilePath);
				writeStatus.cleanedUp = true;
			} catch {
				writeStatus.cleanedUp = false;
			}
		}
		result.diskWriteTest = writeStatus;
	}

	if (wantDebug) result.debug = debug;

	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify(result, null, 2));
}

module.exports = diskinfo;
