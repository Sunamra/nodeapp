/**
 * Files are stored here after upload
 */
const storeDir = './apps/sharefile/storage';
/**
 * Copying files here for temporarily when download requested
 */
const tempStore = './public/tempStore';
/**
 * Concurrent file uploads
 */
const maxFiles = 20;
/**
 * Maximum storage files
 */
const maxTotalFiles = 100;
/**
 * Maximum Storage size : 12 GiB
 */
const maxTotalSize = 12 * 1024 * 1024 * 1024;
/**
 * Maximum single file : 2 GiB
 */
const maxFileSize = 2 * 1024 * 1024 * 1024;

var dirDeleteTimeout = undefined;

const setDirDeleteTimeout = (value) => {
	dirDeleteTimeout = value;

};
const getDirDeleteTimeout = () => dirDeleteTimeout;

module.exports = { storeDir, tempStore, maxFiles, maxTotalFiles, maxTotalSize, maxFileSize, setDirDeleteTimeout, getDirDeleteTimeout };