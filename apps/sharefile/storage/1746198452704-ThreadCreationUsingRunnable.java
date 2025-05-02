// Thread creation using Runnable interface
class ThreadTest2 implements Runnable
{
	Thread t;
	ThreadTest2(String tName)
	{
		t = new Thread(this,tName);
		t.start();
	}
	public void run() // override
	{
		System.out.println(Thread.currentThread());
	}
}
public class ThreadCreationUsingRunnable
{
	public static void main(String args[])
	{
		new ThreadTest2("Uluberia");
		new ThreadTest2("Howrah");
	}
}