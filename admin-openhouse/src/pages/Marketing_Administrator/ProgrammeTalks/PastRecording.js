import React, { Component } from "react";
import fire from "../../../config/firebase";
import history from "../../../config/history";
import { Container, Row, Col, Button, Table, Modal, Tab, Nav, Form, FormControl, InputGroup } from 'react-bootstrap';

import "../../../css/Marketing_Administrator/ProgrammeTalkPastRec.css";
import "../../../css/Marketing_Administrator/AddPastRecModal.css";
import "../../../css/Marketing_Administrator/EditPastRecModal.css";
import "../../../css/Marketing_Administrator/DeletePastRecModal.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMicrophone, faSchool, faCalendarAlt, faHourglassStart, faHourglassEnd, faChair, faUniversity } from '@fortawesome/free-solid-svg-icons';
import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons';

import NavBar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import SideNavBar from '../../../components/SideNavbar';


class PastRecording extends Component {
  constructor() {
    super();
    this.state = {
      awardingUni: "",
      capacityLimit: "",
      date: "",
      endTime: "",
      hasRecording: "",
      isLive: "",
      noRegistered: "",
      startTime: "",
      talkName: "",
      venue: "",
      link: "",

      addPastRecModal: false,
      editPastRecModal: false,
      editPastRecording: false
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

  display= () => {
    var getYear = new Date().getFullYear();
    console.log(getYear);
    
    const db = fire.firestore();
    const pastrecording = [];
    const userRef = db
    .collection("ProgrammeTalks")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        pastrecording.push(doc.data().date);
      });
      console.log(pastrecording);
      
      function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }
      
      var unique = pastrecording.filter(onlyUnique);
      console.log(unique);

      //day1
      const day1date = [];
      day1date.push(unique[0]);
      this.setState({ day1date: day1date });

      const day1  = db
      .collection("ProgrammeTalks").where("date", "==", unique[0])
      .where("hasRecording", "==", true)
      .get()
      .then((snapshot) => {
        const pastrecording = [];
        snapshot.forEach((doc) => {
          const data = {
            docid : doc.id,
            id: doc.data().id,
            talkName:doc.data().talkName,
            awardingUni : doc.data().awardingUni,
            startTime:  doc.data().startTime,     
            endTime: doc.data().endTime,
            venue: doc.data().venue,
            capacityLimit: doc.data().capacityLimit,
            noRegistered: doc.data().noRegistered,
            hasRecording: doc.data().hasRecording.toString(),
            link : doc.data().link,
            isLive: doc.data().isLive.toString(),
          };
          pastrecording.push(data);  
        });
        this.setState({ day1: pastrecording });
      });
                  
      //day 2
      const day2date = [];
      day2date.push(unique[1]);
      this.setState({ day2date: day2date });
      const day2  = db
      .collection("ProgrammeTalks").where("date", "==", unique[1])
      .where("hasRecording", "==", true)
      .get()
      .then((snapshot) => {
        const pastrecording = [];
        snapshot.forEach((doc) => {
          const data = {
            docid : doc.id,
            id: doc.data().id,
            talkName:doc.data().talkName,
            awardingUni : doc.data().awardingUni,
            startTime:  doc.data().startTime,     
            endTime: doc.data().endTime,
            venue: doc.data().venue,
            capacityLimit: doc.data().capacityLimit,
            noRegistered: doc.data().noRegistered,
            hasRecording: doc.data().hasRecording.toString(),
            link : doc.data().link,
            isLive: doc.data().isLive.toString(),
          
          };
          pastrecording.push(data);
        });
        this.setState({ day2: pastrecording });
      });
    });    
  }

  addPastRecording = (e) => {
    e.preventDefault();
    var recordingvalue = document.getElementById("recordingvalue");
    var livestatus = document.getElementById("livestatus");
    recordingvalue = recordingvalue.options[recordingvalue.selectedIndex].value;
    livestatus = livestatus.options[livestatus.selectedIndex].value;
    recordingvalue = (recordingvalue === "true");
    livestatus = (livestatus === "true");

    const db = fire.firestore();
    var lastdoc = db.collection("ProgrammeTalks").orderBy('id','desc')
    .limit(1).get().then((snapshot) =>  {
      snapshot.forEach((doc) => {
        var docid= "";
        var res = doc.data().id.substring(5, 10);
        var id = parseInt(res)
        if(id.toString().length <= 1){
          docid= "talk-00" + (id +1) 
        }
        else if(id.toString().length <= 2){
          docid= "talk-0" + (id +1) 
        }
        else{
          docid="talk-0" + (id +1) 
        }

        const userRef = db
        .collection("ProgrammeTalks")
        .doc(docid)
        .set({
          awardingUni: this.state.awardingUni,
          capacityLimit: this.state.capacityLimit,
          date: this.state.date,
          endTime: this.state.endTime,
          hasRecording: recordingvalue,
          isLive: livestatus,
          noRegistered: this.state.noRegistered,
          startTime: this.state.startTime,
          talkName: this.state.talkName,
          venue: this.state.venue,
          link: this.state.link,
          id: docid,
        })
        .then(function () {
          window.location.reload();
        });
      })
    })
  };

  DeletePastRecording(e, pastrecordingid) {
    const db = fire.firestore();
    const userRef = db
    .collection("ProgrammeTalks")
    .doc(pastrecordingid)
    .delete()
    .then(function () {
      alert("Deleted");
      window.location.reload();
    });
  }

  update(e, pastrecordingid) {
    const talkName = document.getElementById(pastrecordingid + "talkname").value
    const awardingUni = document.getElementById(pastrecordingid + "awarduni").value
    const startTime = document.getElementById(pastrecordingid + "starttime").value
    const endTime = document.getElementById(pastrecordingid + "endtime").value
    const venue = document.getElementById(pastrecordingid + "venue").value
    const link = document.getElementById(pastrecordingid + "link").value

    const db = fire.firestore();
    if (talkName != null && awardingUni != null && startTime != null && endTime != null && venue != null && link != null) {
      const userRef = db
      .collection("ProgrammeTalks")
      .doc(pastrecordingid)
      .update({
        awardingUni: awardingUni,
        endTime: endTime,
        startTime: startTime,
        talkName: talkName,
        venue: venue,
        link: link,
      })
      .then(function () {
        alert("Updated");
        window.location.reload();
      });
    }
  }

  editPastRecording(e, pastrecordingid) {
    document.getElementById(pastrecordingid + "spantalkname").removeAttribute("hidden");
    document.getElementById(pastrecordingid + "spanawarduni").removeAttribute("hidden");
    document.getElementById(pastrecordingid + "spanstarttime").removeAttribute("hidden");
    document.getElementById(pastrecordingid + "spanendtime").removeAttribute("hidden");
    document.getElementById(pastrecordingid + "spanvenue").removeAttribute("hidden");
    document.getElementById(pastrecordingid + "spanlink").removeAttribute("hidden");
    document.getElementById(pastrecordingid + "editbutton").setAttribute("hidden", "");
    document.getElementById(pastrecordingid + "updatebutton").removeAttribute("hidden");
    document.getElementById(pastrecordingid + "cancelbutton").removeAttribute("hidden");
    var texttohide = document.getElementsByClassName(
      pastrecordingid + "text"
    );
    for (var i = 0; i < texttohide.length; i++) {
      texttohide[i].setAttribute("hidden", "");
    }  
  }

  // CancelEdit(e, pastrecordingid) {
  //   document.getElementById(pastrecordingid + "spantalkname").setAttribute("hidden", "");
  //   document.getElementById(pastrecordingid + "spanawarduni").setAttribute("hidden", "");
  //   document.getElementById(pastrecordingid + "spanstarttime").setAttribute("hidden", "");
  //   document.getElementById(pastrecordingid + "spanendtime").setAttribute("hidden", "");
  //   document.getElementById(pastrecordingid + "spanvenue").setAttribute("hidden", "");
  //   document.getElementById(pastrecordingid + "spanlink").setAttribute("hidden", "");
  //   document.getElementById(pastrecordingid + "editbutton").removeAttribute("hidden");
  //   document.getElementById(pastrecordingid + "updatebutton").setAttribute("hidden", "");
  //   document.getElementById(pastrecordingid + "cancelbutton").setAttribute("hidden", "");
  //   var texttohide = document.getElementsByClassName(
  //     pastrecordingid + "text"
  //   );
  //   for (var i = 0; i < texttohide.length; i++) {
  //     texttohide[i].removeAttribute("hidden", "");
  //   }
  // }

  /* Add Past Rec Modal */
  handleAddPastRecModal = () => {
    if (this.state.addPastRecModal == false) {
      this.setState({
        addPastRecModal: true,
      });
    }
    else {
      this.setState({
        addPastRecModal: false
      });
    }
  };

  /* Edit Past Rec Modal */
  handleEditPastRecModal = (day) => {
    if (this.state.editPastRecModal == false) {
      this.setState({
        editPastRecModal: true,
        awardingUni: day.awardingUni,
        capacityLimit: day.capacityLimit,
        date: day.date,
        endTime: day.endTime,
        hasRecording: day.hasRecording,
        isLive: day.isLive,
        noRegistered: day.noRegistered,
        startTime: day.startTime,
        talkName: day.talkName,
        venue: day.venue,
        link: day.link,
        progTalkDetails: day.progTalkDetails,
        discipline: day.discipline
      })
    }
    else {
      this.setState({
        editPastRecModal: false
      });
    }
  };

  /* Delete Past Rec Modal */
  handleDeletePastRecModal = () => {
    if (this.state.deletePastRecModal == false) {
      this.setState({
        deletePastRecModal: true,
      });
    }
    else {
      this.setState({
        deletePastRecModal: false
      });
    }
  };


  render() {
    return (
      <div>
        <Container fluid className="MAPastRecCon">
          <NavBar isMA={true} />

          <Container fluid className="MAPastRecContent">
            <Row>
              {/* SideNavBar Col */}
              <Col md="2" style={{paddingRight:"0"}} className="sideNavBarCol">
                <SideNavBar />
              </Col>

              {/* Contents Col */}
              <Col md="10" style={{paddingLeft:"0"}}>
                <Container fluid className="MAPastRecContentCon">
                  {/* Programme Talks Schedule Page Header row */}
                  <Row id="MAPastRecContentHeaderRow" className="justify-content-center">
                    <Col md="6" className="text-left MAPastRecContentHeaderCol">
                      <h4 id="MAPastRecHeaderText">Programme Talks Schedule</h4>
                    </Col>

                    <Col md="6" className="text-right MAPastRecContentHeaderCol">
                      <Button id="addPastRecBtn" onClick={this.handleAddProgTalkModal}>
                        <FontAwesomeIcon size="lg" id="addPastRecBtnIcon" icon={faPlus} />
                        <span id="addPastRecBtnText">Add</span>
                      </Button>
                    </Col>
                  </Row>

                  {/* Tabs row */}
                  <Row className="MAPastRecContentTabRow">
                    <Col md="12" className="MAPastRecContentTabCol">

                      <Tab.Container defaultActiveKey="day1">
                        <Row className="MAPastRecTabConRow">
                          <Col md="12" className="MAPastRecTabConCol">
                            <Nav defaultActiveKey="day1" className="MAPastRecTabNav" variant="tabs">
                              <Col md="6" className="MAPastRecTabConInnerCol text-center">
                                <Nav.Item className="MAPastRecTab_NavItem">
                                  <Nav.Link eventKey="day1" className="MAPastRecTab_Day">{this.state.day1Date}</Nav.Link>
                                </Nav.Item>
                              </Col>  

                              <Col md="6" className="MAPastRecTabConInnerCol text-center">
                                <Nav.Item className="MAPastRecTab_NavItem">
                                  <Nav.Link eventKey="day2" className="MAPastRecTab_Day">{this.state.day2Date}</Nav.Link>
                                </Nav.Item>
                              </Col>
                            </Nav>
                          </Col>

                        </Row>

                        <Row className="MAPastRecTabConRow justify-content-center">
                          <Col md="12" className="MAPastRecTabConCol text-center">
                            <Tab.Content id="MAPastRecTabPane_Day1">
                              {/* Tab Pane 1 */}
                              <Tab.Pane eventKey="day1">
                                <Col md="12" className="MAPastRecTabpaneCol">
                                  <Table responsive="sm" bordered id="MAPastRecTable_Day1">
                                    <thead>
                                      <tr>
                                        <th className="pastRecHeader_SNo">S/N</th>
                                        <th className="pastRecHeader_ProgTalk">Programme Talk</th>
                                        <th className="pastRecHeader_AwardingUni">Awarding University</th>
                                        <th className="pastRecHeader_StartTime">Start Time</th>
                                        <th className="pastRecHeader_EndTime">End Time</th>
                                        <th className="pastRecHeader_Venue">Venue</th>
                                        <th className="pastRecHeader_File">File</th>
                                        <th className="pastRecHeader_Discipline">Discipline(s)</th>
                                        <th className="pastRecHeader_Edit">Edit</th>
                                        <th className="pastRecHeader_Delete">Delete</th>
                                      </tr>
                                    </thead>

                                    {this.state.day1 && this.state.day1.map((day1) => {
                                      return (
                                        <>
                                          <tbody>
                                            <tr key={day1.id}>
                                              <td className="pastRecData_SNo">{day1.day1_counter}</td>
                                              <td className="pastRecData_ProgTalk text-left">{day1.talkName}</td>
                                              <td className="pastRecData_AwardingUni">{day1.awardingUni}</td>
                                              <td className="pastRecData_StartTime text-left">{day1.startTime}</td>
                                              <td className="pastRecData_EndTime text-left">{day1.endTime}</td>
                                              <td className="pastRecData_Venue text-left">{day1.venue}</td>
                                              <td className="pastRecData_File text-center">{day1.file}</td>
                                              <td className="pastRecData_Discipline text-center">{day1.discipline}</td>
                                              <td className="pastRecData_Edit">
                                                <Button id="editPastRecBtn" onClick={()=>this.handleEditPastRecModal(day1)}>
                                                  <FontAwesomeIcon size="lg" id="editPastRecBtnIcon" icon={faEdit} />
                                                </Button>
                                              </td>
                                              <td className="pastRecData_Delete">
                                                <Button id="deletePastRecBtn" onClick={this.handleDeletePastRecModal}>
                                                  <FontAwesomeIcon size="lg" id="deletePastRecBtnIcon" icon={faTrashAlt} />
                                                </Button>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </>
                                      );
                                    })}

                                  </Table>
                                </Col>
                              </Tab.Pane>

                              {/* Tab Pane 2 */}
                              <Tab.Pane eventKey="day2">
                                <Col md="12" className="MAPastRecTabpaneCol">
                                  <Table responsive="sm" bordered id="MAPastRecTable_Day2">
                                    <thead>
                                      <tr>
                                        <th className="pastRecHeader_SNo">S/N</th>
                                        <th className="pastRecHeader_ProgTalk">Programme Talk</th>
                                        <th className="pastRecHeader_AwardingUni">Awarding University</th>
                                        <th className="pastRecHeader_StartTime">Start Time</th>
                                        <th className="pastRecHeader_EndTime">End Time</th>
                                        <th className="pastRecHeader_Venue">Venue</th>
                                        <th className="pastRecHeader_File">File</th>
                                        <th className="pastRecData_Discipline">Discipline(s)</th>
                                        <th className="pastRecData_Edit">Edit</th>
                                        <th className="pastRecData_Delete">Delete</th>
                                      </tr>
                                    </thead>

                                    {this.state.day2 && this.state.day2.map((day2) => {
                                      return (
                                        <>
                                          <tbody>
                                            <tr key={day2.id}>
                                              <td className="pastRecData_SNo">{day2.day2_counter}</td>
                                              <td className="pastRecData_ProgTalk text-left">{day2.talkName}</td>
                                              <td className="pastRecData_AwardingUni">{day2.awardingUni}</td>
                                              <td className="pastRecData_StartTime text-left">{day2.startTime}</td>
                                              <td className="pastRecData_EndTime text-left">{day2.endTime}</td>
                                              <td className="pastRecData_Venue text-left">{day2.venue}</td>
                                              <td className="pastRecData_File text-center">{day2.file}</td>
                                              <td className="pastRecData_Discipline text-center">{day2.discipline}</td>
                                              <td className="pastRecData_Edit">
                                                <Button id="editPastRecBtn" onClick={()=>this.handleEditPastRecModal(day2)}>
                                                  <FontAwesomeIcon size="lg" id="editPastRecBtnIcon" icon={faEdit} />
                                                </Button>
                                              </td>
                                              <td className="pastRecData_Delete">
                                                <Button id="deletePastRecScheduleBtn" onClick={this.handleDeletePastRecModal}>
                                                  <FontAwesomeIcon size="lg" id="deletePastRecBtnIcon" icon={faTrashAlt} />
                                                </Button>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </>
                                      );
                                    })}

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




        {/* day1 */}
        {/* <div>
        {this.state.day1date && this.state.day1date.map((day1) => {
          return (
            <p>{day1}</p>
          )})}
          <table id="users" class="table table-bordered"> 
            <tbody>
              <tr>
                <th scope="col">S/N</th>
                <th scope="col">Programme Talk</th>
                <th scope="col">Awarding University</th>
                <th scope="col">Start Time</th>
                <th scope="col">End Time</th>
                <th scope="col">Venue</th>
                <th scope="col">Link</th>
                <th scope="col">Edit</th>
                <th scope="col">Delete</th>
              </tr>
              {this.state.day1 &&
                this.state.day1.map((day1, index) => {
                  return (
                    <tr>
                        <td>{index+1}</td>
                      <td>
                      <span class={day1.docid + "text"}>
                      {day1.talkName}
                        </span>
                          <span id={day1.docid + "spantalkname"} hidden>
                          <input
                            id={day1.docid + "talkname"}
                            defaultValue={day1.talkName}
                            type="text"
                            name={day1.docid + "talkname"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={day1.talkName}
                            required
                          />
                        </span>            
                      </td>
                      <td>
                      <span class={day1.docid + "text"}>
                      {day1.awardingUni}
                        </span>
                          <span id={day1.docid + "spanawarduni"} hidden>
                          <input
                            id={day1.docid + "awarduni"}
                            defaultValue={day1.awardingUni}
                            type="text"
                            name={day1.docid + "awarduni"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={day1.awardingUni}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={day1.docid + "text"}>
                      {day1.startTime}
                        </span>
                          <span id={day1.docid + "spanstarttime"} hidden>
                          <input
                            id={day1.docid + "starttime"}
                            defaultValue={day1.startTime}
                            type="text"
                            name={day1.docid + "starttime"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={day1.startTime}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={day1.docid + "text"}>
                      {day1.endTime}
                        </span>
                          <span id={day1.docid + "spanendtime"} hidden>
                          <input
                            id={day1.docid + "endtime"}
                            defaultValue={day1.endTime}
                            type="text"
                            name={day1.docid + "endtime"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={day1.endTime}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={day1.docid + "text"}>
                      {day1.venue}
                        </span>
                          <span id={day1.docid + "spanvenue"} hidden>
                          <input
                            id={day1.docid + "venue"}
                            defaultValue={day1.venue}
                            type="text"
                            name={day1.docid + "venue"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={day1.venue}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={day1.docid + "text"}>
                      {day1.link}
                        </span>
                          
                        <span id={day1.docid + "spanlink"} hidden>
                        <input
                          id={day1.docid + "link"}
                          defaultValue={day1.link}
                          type="text"
                          name={day1.docid + "link"}
                          class="form-control"
                          aria-describedby="emailHelp"
                          placeholder={day1.link}
                          required
                        />
                        </span>            
                      </td>
                      <td>
                        <button id={day1.docid + "editbutton"}onClick={(e) => {this.editPastRecording(e, day1.docid); }}>
                          Edit
                        </button>

                        <button id={day1.docid + "updatebutton"} hidden onClick={(e) => {this.update(e, day1.docid);}}>
                          Update
                        </button>
                        <button hidden id={day1.docid + "cancelbutton"} onClick={(e) => {this.CancelEdit(e, day1.docid);}}>
                          Cancel
                        </button>
                      </td>
                      <td>
                        <button onClick={(e) => {this.DeletePastRecording(e, day1.docid);}}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div> */}
        
        {/* day2 */}
        {/* {this.state.day2date && this.state.day2date.map((day2) => {
          return (
            <p>{day2}</p>
          )})}
          <table id="users" class="table table-bordered"> 
            <tbody>
              <tr>
                <th scope="col">S/N</th>
                <th scope="col">Programme Talk</th>
                <th scope="col">Awarding University</th>
                <th scope="col">Start Time</th>
                <th scope="col">End Time</th>
                <th scope="col">Venue</th>
                <th scope="col">Link</th>
                <th scope="col">Edit</th>
                <th scope="col">Delete</th>
              </tr>
              {this.state.day2 &&
                this.state.day2.map((day2,index) => {
                  return (
                    <tr>
                        <td>{index+1}</td>
                      <td>
                      <span class={day2.docid + "text"}>
                      {day2.talkName}
                        </span>
                          
                          <span id={day2.docid + "spantalkname"} hidden>
                          <input
                            id={day2.docid + "talkname"}
                            defaultValue={day2.talkName}
                            type="text"
                            name={day2.docid + "talkname"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={day2.talkName}
                            required
                          />
                        </span>            
                      </td>
                      <td>
                      <span class={day2.docid + "text"}>
                      {day2.awardingUni}
                        </span>
                          <span id={day2.docid + "spanawarduni"} hidden>
                          <input
                            id={day2.docid + "awarduni"}
                            defaultValue={day2.awardingUni}
                            type="text"
                            name={day2.docid + "awarduni"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={day2.awardingUni}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={day2.docid + "text"}>
                      {day2.startTime}
                        </span>
                          <span id={day2.docid + "spanstarttime"} hidden>
                          <input
                            id={day2.docid + "starttime"}
                            defaultValue={day2.startTime}
                            type="text"
                            name={day2.docid + "starttime"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={day2.startTime}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={day2.docid + "text"}>
                      {day2.endTime}
                        </span>
                          <span id={day2.docid + "spanendtime"} hidden>
                          <input
                            id={day2.docid + "endtime"}
                            defaultValue={day2.endTime}
                            type="text"
                            name={day2.docid + "endtime"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={day2.endTime}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={day2.docid + "text"}>
                      {day2.venue}
                        </span>
                          <span id={day2.docid + "spanvenue"} hidden>
                          <input
                            id={day2.docid + "venue"}
                            defaultValue={day2.venue}
                            type="text"
                            name={day2.docid + "venue"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={day2.venue}
                            required
                          />
                        </span>  
                      </td>
                      <td>
                      <span class={day2.docid + "text"}>
                      {day2.link}
                        </span>
                          
                          <span id={day2.docid + "spanlink"} hidden>
                          <input
                            id={day2.docid + "link"}
                            defaultValue={day2.link}
                            type="text"
                            name={day2.docid + "link"}
                            class="form-control"
                            aria-describedby="emailHelp"
                            placeholder={day2.link}
                            required
                          />
                        </span>            
                      </td>
                      <td>
                        <button
                          id={day2.docid + "editbutton"}
                          onClick={(e) => {
                            this.editLiveTalk(e, day2.docid);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          id={day2.docid + "updatebutton"}
                          hidden
                          onClick={(e) => {
                            this.update(e, day2.docid);
                          }}
                        >
                          Update
                        </button>
                        <button
                          hidden
                          id={day2.docid + "cancelbutton"}
                          onClick={(e) => {
                            this.CancelEdit(e, day2.docid);
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={(e) => {
                            this.DeleteLiveTalk(e, day2.docid);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <form onSubmit={this.addPastRecording}>
          <input
            type="text"
            name="talkName"
            placeholder="Programme Talk"
            onChange={this.updateInput}
            value={this.state.talkName}
            required
          />
          <input
            type="text"
            name="date"
            placeholder="Date"
            onChange={this.updateInput}
            value={this.state.date}
            required
          />
          <input
            type="text"
            name="startTime"
            placeholder="Start Time"
            onChange={this.updateInput}
            value={this.state.startTime}
            required
          />
          <input
            type="text"
            name="endTime"
            placeholder="End Time"
            onChange={this.updateInput}
            value={this.state.endTime}
            required
          />
          <input
            type="text"
            name="awardingUni"
            placeholder="Awarding University"
            onChange={this.updateInput}
            value={this.state.awardingUni}
            required
          />
          <input
            type="text"
            name="venue"
            placeholder="Venue"
            onChange={this.updateInput}
            value={this.state.venue}
            required
          />
          <input
            type="text"
            name="capacityLimit"
            placeholder="Capacity Limit"
            onChange={this.updateInput}
            value={this.state.capacityLimit}
            required
          />
          <select id = "recordingvalue" required>
            <option disabled selected value></option>
            <option value="true">true</option>
            <option value="false">false</option>
          </select>

          <select id = "livestatus" required>
            <option disabled selected value></option>
            <option value="true">true</option>
            <option value="false">false</option>
          </select>

          <input
            type="text"
            name="noRegistered"
            placeholder="No of Student Registered"
            onChange={this.updateInput}
            value={this.state.noRegistered}
            required
          />
          <input
            type="text"
            name="link"
            placeholder="Link"
            onChange={this.updateInput}
            value={this.state.link}
            required
          />
          <button type="submit">Add Past Recording</button>
        </form> */}
      </div>
    );
  }
}
export default PastRecording;
