import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
    return ( 
      <nav className="navbar-container">
        <Link href="/">
          <Image src="/logo.jfif" alt="Logo" width={80} height={80} />
          <p>Automation App</p>
        </Link>

        <Link href="/map">map</Link>
         
      </nav>
    );
  }
 
export default Navbar;