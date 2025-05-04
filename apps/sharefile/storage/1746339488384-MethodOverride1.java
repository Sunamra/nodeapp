class A1
{
	void f(int a, int b)
	{
		System.out.println(a + b);
	}
}
class B3 extends A1
{
	public void f(int a, int b) // Override
	{
		super.f(3,2); // f() of class A will be called
		System.out.println(a * b);
	}
}
public class MethodOverride1
{
	public static void main(String args[])
	{
		A1 r = new B3(); // Upcasting
		r.f(4,2); // f() of class B3 will be called
	}
}