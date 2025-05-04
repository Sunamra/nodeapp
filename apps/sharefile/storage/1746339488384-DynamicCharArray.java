import java.util.Scanner;

public class DynamicCharArray {

	public static void main(String args[]) {
		Scanner sc = new Scanner(System.in);

		System.out.print("Number of Characters : ");
		int n = sc.nextInt();

		char arr[] = new char[n];
		System.out.println("\nEnter "+ n +" Characters..");

		for (int i = 0; i < arr.length; i++) {
			arr[i] = sc.next().charAt(0);
		}
		System.out.print("\nInserted Characters : ");
		for (int i = 0; i < arr.length; i++) {
			System.out.print(arr[i] + " ");
		}
		sc.close();
	}
}
