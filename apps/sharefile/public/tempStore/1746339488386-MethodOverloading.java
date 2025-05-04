class A2
{
	void f(int a)
	{
		//this(5,6); // error: call to this must be first statement in constructor
		System.out.println(a + a);
	}
	void f(int a, int b)
	{
		System.out.println(a+b);
	}
}

public class MethodOverloading
{
	public static void main(String args[])
	{
		A2 obj = new A2();

		obj.f(2);
		obj.f(2,3);
	}
}