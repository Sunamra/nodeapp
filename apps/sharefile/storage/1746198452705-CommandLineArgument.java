public class CommandLineArgument
{
	public static void main(String args[])
	{
		if (args.length == 0)
		{
			System.out.println("Yes! Java Supports Zero Length Array.");
		}

		else
		{
			for(int i = 0; i < args.length; i++)
			{
				System.out.println("Argument "+ i + " : " + args[i]);
			}
		}
	}
}