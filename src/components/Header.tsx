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
import { useSarauMaker } from "../hooks/useSarauMaker";

function Header() {
  const sarauMaker = useSarauMaker();
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <Navbar expand="md" color="black" dark>
      <NavbarBrand tag={Link} to="/">
        Sarau.XYZ
      </NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="me-auto" navbar>
          <NavItem>
            <NavLink tag={Link} to="/create">
              Create
            </NavLink>
          </NavItem>
          {/* <NavItem>
            <NavLink tag={Link} to="/mint">
              Mint
            </NavLink>
          </NavItem> */}
          {sarauMaker.data.isAdmin === "1" && (
            <NavItem onClick={() => sarauMaker.updateCeloPrice()}>
              <NavLink>Update CELO price</NavLink>
            </NavItem>
          )}
        </Nav>
        <ConnectButton
          showBalance={{
            smallScreen: false,
            largeScreen: true,
          }}
        />
      </Collapse>
    </Navbar>
  );
}

export default Header;
