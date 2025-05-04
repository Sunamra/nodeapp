public class CountArrayDigits {

	public static void main(String[] args) {
		int arr[] = { 1, 2, 3, 4, 5, 2, 3, 2, 1, 6, 4, 5, 3, 5, 1, 5 };
		int n = arr.length;
		int count, temp;

		bubbleSort(arr);

		for (int i = 0; i < n; i++) {

			count = 0;
			temp = arr[i];

			for (; i < n && temp == arr[i]; i++) {
				count++;
			}
			System.out.println(temp + " : " + count);

			i--; // Balancing array index, otherwise it will skip first values from 2nd iteration
		}

		System.out.print("\nSorted Elements : ");
		for (int i : arr) {
			System.out.print(i + " ");
		}

	}

	static void bubbleSort(int arr[]) {
		for (int i = 0; i < arr.length - 1; i++) {
			for (int j = 0; j < arr.length - 1 - i; j++) {

				if (arr[j] > arr[j + 1]) {
					int temp = arr[j];
					arr[j] = arr[j + 1];
					arr[j + 1] = temp;
				}
			}
		}
	}
}