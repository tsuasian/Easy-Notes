import React from 'react';
import {Navbar, NavbarHeader, NavbarBrand, Nav, NavItem, MenuItem, NavDropdown} from 'react-bootstrap';
import Button from 'react-bootstrap/lib/Button';

class Toolbar extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      // <div>
      //   <Button className='btn btn-primary'>test</Button>
      //   <Navbar>
      //     <Navbar.Header>
      //       <Navbar.Brand>
      //         <a href="https://google.com">React-Bootstrap</a>
      //       </Navbar.Brand>
      //     </Navbar.Header>
      //     <Nav>
      //       <NavItem eventKey={1} href="#">
      //         Link
      //       </NavItem>
      //       <NavItem eventKey={2} href="#">
      //         Link
      //       </NavItem>
      //       <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
      //         <MenuItem eventKey={3.1}>Action</MenuItem>
      //         <MenuItem eventKey={3.2}>Another action</MenuItem>
      //         <MenuItem eventKey={3.3}>Something else here</MenuItem>
      //         <MenuItem divider />
      //         <MenuItem eventKey={3.4}>Separated link</MenuItem>
      //       </NavDropdown>
      //     </Nav>
      //   </Navbar>
      // </div>
      null
    );
  }
}

export default Toolbar;
