const storeDir = "./apps/sharefile/public/storage";
/**
 * Concurrent file uploads
 */
const maxFiles = 10;
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

module.exports = { storeDir, maxFiles, maxTotalFiles, maxTotalSize, maxFileSize };