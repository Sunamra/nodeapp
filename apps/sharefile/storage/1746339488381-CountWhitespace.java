import java.util.Scanner;

public class CountWhitespace {
	public static void main(String args[]) {
		Scanner sc = new Scanner(System.in);

		System.out.print("String : ");
		String str = sc.nextLine();
		int flag = 0;

		// String str = "abc\td\nefg\rwv";

		// char[] arr = str.toCharArray();

		// for (int i = 0; i < arr.length; i++) {
		// if (Character.isWhitespace(arr[i])) {
		// flag++;
		// }
		// }

		for (int i = 0; i < str.length(); i++) {
			if (Character.isWhitespace(str.charAt(i))) {
				flag++;
			}
		}

		System.out.print("\nThere are " + flag + " White Spaces in the Given String");

		sc.close();
	}
}