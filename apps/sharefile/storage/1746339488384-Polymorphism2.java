class A8
{
	void f()
	{
		System.out.println("Hello");
	}
}
class B2 extends A8
{
	void f()
	{
		System.out.println("Hii");
	}
}
public class Polymorphism2
{
	public static void main(String args[])
	{
		A8 r = new B2(); // Upcasting
		r.f();
	}
}