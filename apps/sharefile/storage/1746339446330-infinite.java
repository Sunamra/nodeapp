import java.io.File;

public class infinite {
    private static int fileCount = 0;
    private static int folderCount = 0;
    private static volatile boolean reading = false;
    private static long totalBytes = 0;
    private static String nowListing = "";

    public static void main(String[] args) {

        File path = new File("C:\\Windows");

        if (!path.exists()) {
            System.err.println("'" + path.getAbsolutePath() + "' Doesn't Exist!");
            System.exit(1);
        }

        Thread thread1 = new Thread(() -> {

            File[] paths = path.listFiles();
            // for (File string : paths) {
            // try {
            // System.out.println(string.getAbsolutePath());
            // } catch (Exception e) {
            // }
            // }
            // System.exit(fileCount);
            reading = true;
            for (int i = 0; i < paths.length; i++) {
                if (paths[i].isFile()) {
                    fileCount++;
                } else if (paths[i].isDirectory()) {
                    folderCount++;
                    nowListing = paths[i].toString();
                    folderSize(paths[i]);
                }
            }
            reading = false;

        });

        thread1.start();

        while (!reading) {
            // System.out.print("\rWaiting... ");
        }

        while (reading) {
            System.out.print("\r" + nowListing + ", File: " + fileCount + ", Folder: " + folderCount + ", Total: "
                    + totalBytes + " Bytes  ");

            sleep(100);
        }
        System.out.print("\r" + nowListing + ", File: " + fileCount + ", Folder: " + folderCount + ", Total: "
                + totalBytes + " Bytes  ");

    }

    static long folderSize(File folderName) {

        if (folderName.isFile()) {
            System.err.println(
                    "\nWarning : File " + folderName.getName() + " Passed in folderSize() ");
            return folderName.length();
        }

        File[] items = folderName.listFiles();

        long totalSize = 0;

        if (items != null) {
            for (File item : items) {
                if (item.isDirectory()) {
                    folderCount++;
                    totalSize += folderSize(item);
                } else {
                    fileCount++;
                    totalSize += item.length();
                }
            }
        }

        return totalSize;
    }

    static void sleep(long millis) {
        try {
            // to sleep 10 seconds
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            // recommended because catching InterruptedException clears interrupt flag
            Thread.currentThread().interrupt();
            // you probably want to quit if the thread is interrupted
        }
    }
}
