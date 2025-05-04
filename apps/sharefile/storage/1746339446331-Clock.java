/*import java.time.LocalTime;

public class Clock
{
	public static void main(String[] args)
	{
		while (true)
		{
			LocalTime currentTime = LocalTime.now();

			System.out.print("\rCurrent time: " + currentTime);
		}
	}
}*/

/*
 * The program below similarly prints time but
 * pressing Enter key notes current time
 */

import java.time.LocalTime;
import java.util.Scanner;

public class Clock {

	/**
	 * The <code>volatile</code> keyword in Java is used to declare variables as
	 * <code>volatile</code>, indicating that their value may be modified by
	 * multiple threads and should always be read directly from the main memory,
	 * rather than from the thread's cache.
	 * This ensures that all threads see the same value for the
	 * <code>volatile</code> variable, even if one thread has recently updated it.
	 */
	private static volatile boolean noteTime = false;

	public static void main(String[] args) {
		Thread timePrinterThread = new Thread(Clock::printTime);
		timePrinterThread.start();

		Scanner scanner = new Scanner(System.in);
		try {
			System.out.println("Press Enter to note the time.");

			while (true) {
				scanner.next(); // Wait for the user to press Enter
				noteTime = true; // Set the flag to note the time
			}
		} catch (Exception e) {
		} finally {
			scanner.close();
		}
	}

	private static void printTime() {
		while (true) {
			System.out.print("\rCurrent time: " + LocalTime.now());
			if (noteTime) {
				System.out.println(); // Move to the next line to note the time
				noteTime = false; // Reset the flag after noting the time
			}
		}
	}
}
