// Thread deadlock
public class DeadLockManager
{
	String o1="Lock";
	String o2="Stop";
	Thread t1=(new Thread("Printer-1")
		{
			public void run()
			{
				while(true)
				{
					synchronized(o1)
					{
					synchronized(o2)
					{
						System.out.println(o1+o2);
					}
					}
				}
			}
		});
	Thread t2=(new Thread("Printer-2")
	{
		public void run()
		{
			while(true)
			{
				synchronized(o2)
				{
				synchronized(o2)
				{
					System.out.println(o2+o1);
				}
				}
			}
		}
	});
	public static void main(String args[])
	{
		DeadLockManager dlm =new DeadLockManager();
		dlm.t1.start();
		dlm.t2.start();
	}
}