
interface X
{
	void f();
}
interface Y
{
	void f();
	void g();
}
class Z implements X,Y
{
	public void f()
	{
		System.out.println("Hello");
	}
	public void g()
	{
		System.out.println("Hii");
	}
}
public class MultipleInheritanceUsingInterface  {

	public static void main(String[] args) {
		Z r = new Z();
		r.f();
		r.g();

	}

}

