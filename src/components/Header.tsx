import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <Navbar expand="md">
      <NavbarBrand tag={Link} to="/">
        Sarau.xyz
      </NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="me-auto" navbar>
          <NavItem>
            <NavLink tag={Link} to="/create">
              Create
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/mint">
              Mint
            </NavLink>
          </NavItem>
        </Nav>
        <ConnectButton />
      </Collapse>
    </Navbar>
  );
}

export default Header;
