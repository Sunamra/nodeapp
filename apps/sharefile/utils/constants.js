/**
 * Storing files after upload
 */
const storeDir = './apps/sharefile/storage';
/**
 * Copying files here for temporarily when download requested
 */
const tempStore = '/public/tempStore';
/**
 * Concurrent file uploads
 */
const maxFiles = 20;
/**
 * Maximum storage files
 */
const maxTotalFiles = 100;
/**
 * Maximum Storage size : 400 MiB
 */
const maxTotalSize = 300 * 1024 * 1024;
/**
 * Maximum single file : 50 MiB
 */
const maxFileSize = 50 * 1024 * 1024;

var dirDeleteTimeout = undefined;

const setDirDeleteTimeout = (value) => {
	dirDeleteTimeout = value;

};
const getDirDeleteTimeout = () => dirDeleteTimeout;

module.exports = { storeDir, tempStore, maxFiles, maxTotalFiles, maxTotalSize, maxFileSize, setDirDeleteTimeout, getDirDeleteTimeout };