class A3
{
	void f()
	{
		System.out.println("Hello");
	}
}
class B1 extends A3
{
	public void f() // Polymorphic Behavior
	{
		System.out.println("Hii");
	}
	void g() // Non-Polymorphic Behavior
	{
		System.out.println("How are You?");
	}
}
public class Polymorphism1
{
	public static void main(String args[])
	{
		A3 r = new B1(); // Upcasting
		r.f(); // Okay
		// r.g(); // Error

		/*
		B r1 = new B(); // High Space & Time Complexity
		r1.g(); // Okay
		*/

		B1 r1 = (B1) r; // Downcasting
		r1.g();
	}
}