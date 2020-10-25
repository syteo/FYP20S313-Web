import { Container, Row, Col, Table, Button, Tab, Nav, Modal, Form } from 'react-bootstrap';
import React, { Component } from "react";
import fire from "../../../config/firebase";
import history from "../../../config/history";

import '../../../css/Marketing_Administrator/Performances.css';
import NavBar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import SideNavBar from '../../../components/SideNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faHourglassEnd, faHourglassStart, faPlus, faSchool, faTrash, faMapPin, faCalendarAlt, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

class Performances extends Component {
    constructor() {
        super();
        this.state = {
            date: "",
            endTime: "",
            startTime: "",
            performanceName: "",
            venue: "",
        };
    }

    authListener() {
        fire.auth().onAuthStateChanged((user) => {
            if (user) {
                const db = fire.firestore();
                var getrole = db
                .collection("Administrators")
                .where("email", "==", user.email);
                getrole.get().then((snapshot) => {
                    snapshot.forEach((doc) => {
                        if (doc.data().administratorType === "Marketing Administrator") {
                            this.display();
                        } else {
                            history.push("/Login");
                        }
                    });
                });
            } else {
                history.push("/Login");
            }
        });
    }

    updateInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    componentDidMount() {
        this.authListener();
    }

    display = () => {
        var getYear = new Date().getFullYear();
        console.log(getYear);
    
        const db = fire.firestore();
        const performance = [];
        const userRef = db
        .collection("Performances")
        .get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                performance.push(doc.data().date);
            });
            console.log(performance);
            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }
            var unique = performance.filter(onlyUnique);
            console.log(unique);

            //day1
            /*const day1date = [];
            day1date.push(unique[0]);
            this.setState({ day1date: day1date });*/
            const day1 = db
            .collection("Performances")
            .where("date", "==", unique[0])
            .get()
            .then((snapshot) => {
                const performance = [];
                snapshot.forEach((doc) => {
                    const data = {
                        docid : doc.id,
                        id: doc.data().id,
                        date: doc.data().date,
                        endTime: doc.data().endTime,
                        startTime: doc.data().startTime,
                        performanceName: doc.data().performanceName,
                        venue: doc.data().venue,
                    };
                    performance.push(data);
                });
                this.setState({ day1: performance });
                                
            });

            //day 2
            /*const day2date = [];
            day2date.push(unique[1]);
            this.setState({ day2date: day2date });*/
            const day2 = db
            .collection("Performances")
            .where("date", "==", unique[1])
            .get()
            .then((snapshot) => {
                const performance = [];
                snapshot.forEach((doc) => {
                    const data = {
                        docid : doc.id,
                        id: doc.data().id,
                        date: doc.data().date,
                        endTime: doc.data().endTime,
                        startTime: doc.data().startTime,
                        performanceName: doc.data().performanceName,
                        venue: doc.data().venue,
                    };
                    performance.push(data);
                });
                this.setState({ day2: performance });
            });
        });
    }

    addPerformance = (e) => {
        e.preventDefault();
        const db = fire.firestore();
        var lastdoc = db.collection("Performances").orderBy('id','desc')
        .limit(1).get().then((snapshot) =>  {
            snapshot.forEach((doc) => {
                var docid= "";
                var res = doc.data().id.substring(12);
                var id = parseInt(res)
                if (id.toString().length <= 1) {
                    docid= "performance-00" + (id +1) 
                } else if(id.toString().length <= 2) {
                    docid= "performance-0" + (id +1) 
                } else {
                    docid="performance-0" + (id +1) 
                }

                const userRef = db
                .collection("Performances")
                .doc(docid)
                .set({
                    date: this.state.date,
                    endTime: this.state.endTime,
                    startTime: this.state.startTime,
                    performanceName: this.state.performanceName,
                    venue: this.state.venue,
                    id: docid,
                })
                .then(function() {
                    window.location.reload();
                });
            })
        })
    };

    DeletePerformance(e, performanceid) {
        const db = fire.firestore();
        const userRef = db
        .collection("Performances")
        .doc(performanceid)
        .delete()
        .then(function () {
            console.log("Deleted the performance");
            window.location.reload();
        });
    }

    update(e, performanceid) {
        const performanceName = document.getElementById(performanceid + "performancename").value
        const startTime = document.getElementById(performanceid + "starttime").value
        const endTime = document.getElementById(performanceid + "endtime").value
        const venue = document.getElementById(performanceid + "venue").value

        const db = fire.firestore();
        if (performanceName != null && startTime != null && endTime != null && venue != null) {
            const userRef = db
            .collection("Performances")
            .doc(performanceid)
            .update({
                endTime: endTime,
                startTime: startTime,
                performanceName: performanceName,
                venue: venue,
            })
            .then(function () {
                console.log("Updated the performance");
                window.location.reload();
            });
        }
    }

    editPerformance(e, performanceid) {
        document.getElementById(performanceid + "spanperformancename").removeAttribute("hidden");
        document.getElementById(performanceid + "spanstarttime").removeAttribute("hidden");
        document.getElementById(performanceid + "spanendtime").removeAttribute("hidden");
        document.getElementById(performanceid + "spanvenue").removeAttribute("hidden");
        document.getElementById(performanceid + "editbutton").setAttribute("hidden", "");
        document.getElementById(performanceid + "updatebutton").removeAttribute("hidden");
        document.getElementById(performanceid + "cancelbutton").removeAttribute("hidden");

        var texttohide = document.getElementsByClassName(
            performanceid + "text"
        );

        for (var i = 0; i < texttohide.length; i++) {
            texttohide[i].setAttribute("hidden", "");
        }  
    }

    CancelEdit(e, performanceid) {
        document.getElementById(performanceid + "spanperformancename").setAttribute("hidden", "");
        document.getElementById(performanceid + "spanstarttime").setAttribute("hidden", "");
        document.getElementById(performanceid + "spanendtime").setAttribute("hidden", "");
        document.getElementById(performanceid + "spanvenue").setAttribute("hidden", "");
        document.getElementById(performanceid + "editbutton").removeAttribute("hidden");
        document.getElementById(performanceid + "updatebutton").setAttribute("hidden", "");
        document.getElementById(performanceid + "cancelbutton").setAttribute("hidden", "");

        var texttohide = document.getElementsByClassName(
            performanceid + "text"
        );

        for (var i = 0; i < texttohide.length; i++) {
            texttohide[i].removeAttribute("hidden", "");
        }
    }

    render() {
        return (
            <div>
                <Container fluid className="Performances-container">
                    <NavBar isMA={true} />

                        <Container fluid className="Performances-content" style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <Row>
                                <Col md={2} style={{paddingRight: 0}}>
                                    <SideNavBar />
                                </Col>

                                <Col md={10} style={{paddingLeft: 0}}>
                                    <Container fluid id="Performances-topContentContainer">
                                        <Row id="Performances-firstRow">
                                            <Col md={6} className="text-left" id="Performances-firstRowCol">
                                                <h4 id="Performances-title">Performances</h4>
                                            </Col>
                                            <Col md={6} className="text-right" id="Performances-firstRowCol">
                                                <Button id="Performances-addBtn"><FontAwesomeIcon size="lg" icon={faPlus} /><span id="Performances-addBtnText">Add</span></Button>
                                            </Col>
                                        </Row>

                                        <Row id="Performances-secondRow">
                                            <Col md={12} id="Performances-secondRowCol">
                                                <Tab.Container defaultActiveKey="day1">
                                                    <Row className="Performances-secondInnerRow">
                                                        <Col md={12} className="Performances-secondInnerCol">
                                                            <Nav defaultActiveKey="day1" className="Performances-nav" variant="tabs">
                                                                <Col md={6} className="text-center Performances-navItemCon">
                                                                    <Nav.Item className="Performances-navItems">
                                                                        <Nav.Link eventKey="day1" className="Performances-navLinks">Day 1</Nav.Link>
                                                                    </Nav.Item>
                                                                </Col>

                                                                <Col md={6} className="text-center Performances-navItemCon">
                                                                    <Nav.Item className="Performances-navItems">
                                                                        <Nav.Link eventKey="day2" className="Performances-navLinks">Day 2</Nav.Link>
                                                                    </Nav.Item>
                                                                </Col>
                                                            </Nav>
                                                        </Col>
                                                    </Row>

                                                    <Row className="Performances-secondInnerRow">
                                                        <Col md={12} className="Performances-secondInnerCol">
                                                            <Tab.Content>
                                                                <Tab.Pane eventKey="day1">
                                                                    <Col md={12} className="text-center Performances-tableColCon">
                                                                        <Table responsive="sm" bordered className="Performances-tableCon">
                                                                            <thead className="Performances-tableHeader">
                                                                                <tr>
                                                                                    <th>S/N</th>
                                                                                    <th>Performance</th>
                                                                                    <th>Start Time</th>
                                                                                    <th>End Time</th>
                                                                                    <th>Venue</th>
                                                                                    <th>Edit</th>
                                                                                    <th>Delete</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className="Performances-tableBody">
                                                                                {this.state.day1 && this.state.day1.map((day1, index) => {
                                                                                    return (
                                                                                        <tr>
                                                                                            <td>{index + 1}</td>
                                                                                            <td>{day1.performanceName}</td>
                                                                                            <td>{day1.startTime}</td>
                                                                                            <td>{day1.endTime}</td>
                                                                                            <td>{day1.venue}</td>
                                                                                            <td><Button size="sm" id="Performances-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                            <td><Button size="sm" id="Performances-deleteBtn"><FontAwesomeIcon size="lg" icon={faTrash}/></Button></td>
                                                                                        </tr>
                                                                                    )
                                                                                })}
                                                                            </tbody>
                                                                        </Table>
                                                                    </Col>
                                                                </Tab.Pane>


                                                                <Tab.Pane eventKey="day2">
                                                                    <Col md={12} className="text-center Performances-tableColCon">
                                                                        <Table responsive="sm" bordered className="Performances-tableCon">
                                                                            <thead className="Performances-tableHeader">
                                                                                <tr>
                                                                                    <th>S/N</th>
                                                                                    <th>Performance</th>
                                                                                    <th>Start Time</th>
                                                                                    <th>End Time</th>
                                                                                    <th>Venue</th>
                                                                                    <th>Edit</th>
                                                                                    <th>Delete</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className="Performances-tableBody">
                                                                                {this.state.day2 && this.state.day2.map((day2, index) => {
                                                                                    return (
                                                                                        <tr>
                                                                                            <td>{index + 1}</td>
                                                                                            <td>{day2.performanceName}</td>
                                                                                            <td>{day2.startTime}</td>
                                                                                            <td>{day2.endTime}</td>
                                                                                            <td>{day2.venue}</td>
                                                                                            <td><Button size="sm" id="Performances-editBtn"><FontAwesomeIcon size="lg" icon={faEdit}/></Button></td>
                                                                                            <td><Button size="sm" id="Performances-deleteBtn"><FontAwesomeIcon size="lg" icon={faTrash}/></Button></td>
                                                                                        </tr>
                                                                                    )
                                                                                })}
                                                                            </tbody>
                                                                        </Table>
                                                                    </Col>
                                                                </Tab.Pane>
                                                            </Tab.Content>
                                                        </Col>
                                                    </Row>

                                                </Tab.Container>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Col>
                            </Row>    
                        </Container>                    

                    <Footer />
                </Container>
            </div>




            // <div className="home">
            //     {/* day1 */}
            //     <div>
            //     {this.state.day1date &&
            //             this.state.day1date.map((day1) => {
            //             return (
            //                 <p>{day1}</p>
            //             )})}
            //     <table id="users" class="table table-bordered"> 
            //         <tbody>
            //         <tr>
            //             <th scope="col">S/N</th>
            //             <th scope="col">Performance</th>
            //             <th scope="col">Start Time</th>
            //             <th scope="col">End Time</th>
            //             <th scope="col">Venue</th>
            //             <th scope="col">Edit</th>
            //             <th scope="col">Delete</th>
            //         </tr>
            //         {this.state.day1 &&
            //             this.state.day1.map((day1,index) => {
            //             return (
            //                 <tr>
            //                     <td>{index+1}</td>
            //                 <td>
            //                 <span class={day1.docid + "text"}>
            //                 {day1.performanceName}
            //                     </span>
                                
            //                     <span id={day1.docid + "spanperformancename"} hidden>
            //                     <input
            //                         id={day1.docid + "performancename"}
            //                         defaultValue={day1.performanceName}
            //                         type="text"
            //                         name={day1.docid + "performancename"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={day1.performanceName}
            //                         required
            //                     />
            //                     </span>            
            //                 </td>
            //                 <td>
            //                 <span class={day1.docid + "text"}>
            //                 {day1.startTime}
            //                     </span>
            //                     <span id={day1.docid + "spanstarttime"} hidden>
            //                     <input
            //                         id={day1.docid + "starttime"}
            //                         defaultValue={day1.startTime}
            //                         type="text"
            //                         name={day1.docid + "starttime"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={day1.startTime}
            //                         required
            //                     />
            //                     </span>  
            //                 </td>
            //                 <td>
            //                 <span class={day1.docid + "text"}>
            //                 {day1.endTime}
            //                     </span>
            //                     <span id={day1.docid + "spanendtime"} hidden>
            //                     <input
            //                         id={day1.docid + "endtime"}
            //                         defaultValue={day1.endTime}
            //                         type="text"
            //                         name={day1.docid + "endtime"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={day1.endTime}
            //                         required
            //                     />
            //                     </span>  
            //                 </td>
            //                 <td>
            //                 <span class={day1.docid + "text"}>
            //                 {day1.venue}
            //                     </span>
            //                     <span id={day1.docid + "spanvenue"} hidden>
            //                     <input
            //                         id={day1.docid + "venue"}
            //                         defaultValue={day1.venue}
            //                         type="text"
            //                         name={day1.docid + "venue"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={day1.venue}
            //                         required
            //                     />
            //                     </span>  
            //                 </td>
            //                 <td>
            //                     <button
            //                     id={day1.docid + "editbutton"}
            //                     onClick={(e) => {
            //                         this.editPerformance(e, day1.docid);
            //                     }}
            //                     >
            //                     Edit
            //                     </button>

            //                     <button
            //                     id={day1.docid + "updatebutton"}
            //                     hidden
            //                     onClick={(e) => {
            //                         this.update(e, day1.docid);
            //                     }}
            //                     >
            //                     Update
            //                     </button>
            //                     <button
            //                     hidden
            //                     id={day1.docid + "cancelbutton"}
            //                     onClick={(e) => {
            //                         this.CancelEdit(e, day1.docid);
            //                     }}
            //                     >
            //                     Cancel
            //                     </button>
            //                 </td>
            //                 <td>
            //                     <button
            //                     onClick={(e) => {
            //                         this.DeletePerformance(e, day1.docid);
            //                     }}
            //                     >
            //                     Delete
            //                     </button>
            //                 </td>
            //                 </tr>
            //             );
            //             })}
            //         </tbody>
            //     </table>
            //     </div>
            //     {/* day2 */}
            //     <div>
            //     {this.state.day2date &&
            //             this.state.day2date.map((day2) => {
            //             return (
            //                 <p>{day2}</p>
            //             )})}
            //     <table id="users" class="table table-bordered"> 
            //         <tbody>
            //         <tr>
            //             <th scope="col">S/N</th>
            //             <th scope="col">Performance</th>
            //             <th scope="col">Start Time</th>
            //             <th scope="col">End Time</th>
            //             <th scope="col">Venue</th>
            //             <th scope="col">Edit</th>
            //             <th scope="col">Delete</th>
            //         </tr>
            //         {this.state.day2 &&
            //             this.state.day2.map((day2,index) => {
            //             return (
            //                 <tr>
            //                     <td>{index+1}</td>
            //                 <td>
            //                 <span class={day2.docid + "text"}>
            //                 {day2.performanceName}
            //                     </span>
                                
            //                     <span id={day2.docid + "spanperformancename"} hidden>
            //                     <input
            //                         id={day2.docid + "performancename"}
            //                         defaultValue={day2.performanceName}
            //                         type="text"
            //                         name={day2.docid + "performancename"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={day2.performanceName}
            //                         required
            //                     />
            //                     </span>            
            //                 </td>
            //                 <td>
            //                 <span class={day2.docid + "text"}>
            //                 {day2.startTime}
            //                     </span>
            //                     <span id={day2.docid + "spanstarttime"} hidden>
            //                     <input
            //                         id={day2.docid + "starttime"}
            //                         defaultValue={day2.startTime}
            //                         type="text"
            //                         name={day2.docid + "starttime"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={day2.startTime}
            //                         required
            //                     />
            //                     </span>  
            //                 </td>
            //                 <td>
            //                 <span class={day2.docid + "text"}>
            //                 {day2.endTime}
            //                     </span>
            //                     <span id={day2.docid + "spanendtime"} hidden>
            //                     <input
            //                         id={day2.docid + "endtime"}
            //                         defaultValue={day2.endTime}
            //                         type="text"
            //                         name={day2.docid + "endtime"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={day2.endTime}
            //                         required
            //                     />
            //                     </span>  
            //                 </td>
            //                 <td>
            //                 <span class={day2.docid + "text"}>
            //                 {day2.venue}
            //                     </span>
            //                     <span id={day2.docid + "spanvenue"} hidden>
            //                     <input
            //                         id={day2.docid + "venue"}
            //                         defaultValue={day2.venue}
            //                         type="text"
            //                         name={day2.docid + "venue"}
            //                         class="form-control"
            //                         aria-describedby="emailHelp"
            //                         placeholder={day2.venue}
            //                         required
            //                     />
            //                     </span>  
            //                 </td>
            //                 <td>
            //                     <button
            //                     id={day2.docid + "editbutton"}
            //                     onClick={(e) => {
            //                         this.editPerformance(e, day2.docid);
            //                     }}
            //                     >
            //                     Edit
            //                     </button>

            //                     <button
            //                     id={day2.docid + "updatebutton"}
            //                     hidden
            //                     onClick={(e) => {
            //                         this.update(e, day2.docid);
            //                     }}
            //                     >
            //                     Update
            //                     </button>
            //                     <button
            //                     hidden
            //                     id={day2.docid + "cancelbutton"}
            //                     onClick={(e) => {
            //                         this.CancelEdit(e, day2.docid);
            //                     }}
            //                     >
            //                     Cancel
            //                     </button>
            //                 </td>
            //                 <td>
            //                     <button
            //                     onClick={(e) => {
            //                         this.DeletePerformance(e, day2.docid);
            //                     }}
            //                     >
            //                     Delete
            //                     </button>
            //                 </td>
            //                 </tr>
            //             );
            //             })}
            //         </tbody>
            //     </table>
            //     </div>
            //     <form onSubmit={this.addPerformance}>
            //     <input
            //         type="text"
            //         name="performanceName"
            //         placeholder="Performance Name"
            //         onChange={this.updateInput}
            //         value={this.state.performanceName}
            //         required
            //     />
            //     <input
            //         type="text"
            //         name="date"
            //         placeholder="Date"
            //         onChange={this.updateInput}
            //         value={this.state.date}
            //         required
            //     />
            //     <input
            //         type="text"
            //         name="startTime"
            //         placeholder="Start Time"
            //         onChange={this.updateInput}
            //         value={this.state.startTime}
            //         required
            //     />
            //     <input
            //         type="text"
            //         name="endTime"
            //         placeholder="End Time"
            //         onChange={this.updateInput}
            //         value={this.state.endTime}
            //         required
            //     />
            //     <input
            //         type="text"
            //         name="venue"
            //         placeholder="Venue"
            //         onChange={this.updateInput}
            //         value={this.state.venue}
            //         required
            //     />
            //     <button type="submit">Add Performance</button>
            //     </form>
            // </div>
        );
    }
}
export default Performances;
