/**
 * Storing files after upload
 */
const storeDir = './apps/sharefile/storage';
/**
 * Copying files here for temporarily when download requested
 */
const tempStore = './apps/sharefile/public/tempStore';
/**
 * Concurrent file uploads
 */
const maxFiles = 20;
/**
 * Maximum storage files
 */
const maxTotalFiles = 100;
/**
 * Maximum Storage size : 3 GiB
 */
const maxTotalSize = 3 * 1024 * 1024 * 1024;
/**
 * Maximum single file : 128 MiB
 */
const maxFileSize = 128 * 1024 * 1024;

var dirDeleteTimeout = undefined;

const setDirDeleteTimeout = (value) => {
	dirDeleteTimeout = value;

};
const getDirDeleteTimeout = () => dirDeleteTimeout;

module.exports = { storeDir, tempStore, maxFiles, maxTotalFiles, maxTotalSize, maxFileSize, setDirDeleteTimeout, getDirDeleteTimeout };