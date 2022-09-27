import { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import ConnectWallet from "./ConnectWallet";

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <Navbar expand="md">
      <NavbarBrand href="/">Sarau.xyz</NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="me-auto" navbar>
          <NavItem>
            <NavLink href="/create">Create</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/mint">Mint</NavLink>
          </NavItem>
        </Nav>
        <ConnectWallet />
      </Collapse>
    </Navbar>
  );
}

export default Header;
