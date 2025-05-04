import java.util.Scanner;

public class DiamondPattern {
	public static void main(String args[]) {
		int n;

		Scanner sc = new Scanner(System.in);

		do {

			System.out.print("\nRows : ");
			n = sc.nextInt();

			if (n <= 1) {
				System.out.println("\nRow Must be Greater than 1 (One)");
			}

		} while (n <= 1);

		System.out.println();

		for (int i = 0; i < n; i++) {
			for (int j = 0; j < n - 1 - i; j++) {
				System.out.print(" ");
			}

			for (int k = 0; k <= i; k++) {
				System.out.print(" *");
			}
			System.out.println();
		}

		for (int i = 0; i < n; i++) {
			for (int j = 0; j <= i; j++) {
				System.out.print(" ");
			}

			for (int k = 0; k < n - 1 - i; k++) {
				System.out.print(" *");
			}
			System.out.println();
		}
		sc.close();
	}
}