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
 * Maximum Storage size : 15 GiB
 */
const maxTotalSize = 15 * 1024 * 1024 * 1024;
/**
 * Maximum single file : 1 GiB
 */
const maxFileSize = 2 * 1024 * 1024 * 1024;

var dirDeleteTimeout = undefined;

const setDirDeleteTimeout = (value) => {
	dirDeleteTimeout = value;

};
const getDirDeleteTimeout = () => dirDeleteTimeout;

module.exports = { storeDir, tempStore, maxFiles, maxTotalFiles, maxTotalSize, maxFileSize, setDirDeleteTimeout, getDirDeleteTimeout };