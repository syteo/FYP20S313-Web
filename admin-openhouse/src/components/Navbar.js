import React from 'react';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import fire from "../config/firebase";
import history from "../config/history";

import "../css/NavBar.css";
import WebAppLogo from "../img/WebAppLogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';


export default class NavBar extends React.Component {
    constructor() {
        super();
        this.logout = this.logout.bind(this);
        this.state = {
            useremail: null,
            isMA: false
          }
      }

    componentDidMount=() =>{
        fire.auth().onAuthStateChanged((user) => {
            if (user) {
              const db = fire.firestore();
              var a  = this;
                    a.setState(() => ({
                      useremail: user.email, })
                    )
                  }  else {
            
            }
          });
         
    }

    logout() {
        fire.auth().signOut();
        history.push("/Login");
      }

    render(){
        return (
            <div>
                {this.props.isMA == false ?
                    <Container fluid className="navbarCon">    
                        <Navbar id="navbar" sticky="top">
                            <Navbar.Brand href="/SAHome" id="webAppLogoNav">
                                <img src={WebAppLogo} id="webAppLogo" />
                            </Navbar.Brand>
                            
                            <Nav id="navContent" className="justify-content-end">
                                <Nav.Item>
                                    <Nav.Link id="SAEmail" className="text-center">{this.state.useremail}</Nav.Link>
                                </Nav.Item>
                                
                                <Nav.Item>
                                    <Button id="logoutBtn" href="/Login" onClick={this.logout} className="text-center">Logout</Button>
                                </Nav.Item>
                                
                            </Nav>
                        </Navbar>

                    </Container>
                    :(
                        <Container fluid className="navbarCon">    
                            <Navbar id="navbar" sticky="top">
                                <Navbar.Brand href="/MAHome" id="webAppLogoNav">
                                    <img src={WebAppLogo} id="webAppLogo" />
                                </Navbar.Brand>
                                
                                <Nav id="navContent" className="justify-content-end">
                                    <Nav.Item>
                                        <Nav.Link id="MAEmail" className="text-center">{this.state.useremail}</Nav.Link>
                                    </Nav.Item>
                                    
                                    <Nav.Item id="navDropdownCon">
                                        <NavDropdown id="navDropdown" alignRight>
                                            <NavDropdown.Item className="navDropdownItem" href="/ChangePassword">
                                                <FontAwesomeIcon className="dropdownNavIcon" icon={faLock} /> Change Password
                                            </NavDropdown.Item>

                                            <NavDropdown.Item className="navDropdownItem" href="/Login" onClick={this.logout}>
                                                <FontAwesomeIcon className="dropdownNavIcon" icon={faSignOutAlt} />Logout
                                            </NavDropdown.Item>
                                        </NavDropdown>
                                    </Nav.Item>
                                    
                                </Nav>
                            </Navbar>

                        </Container>
                    )
                }
            </div>
        )
    }
}
    

