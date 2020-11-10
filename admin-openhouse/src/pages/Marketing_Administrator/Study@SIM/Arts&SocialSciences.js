import React, { Component } from "react";
import fire, { auth, db } from "../../../config/firebase";
import history from "../../../config/history";
import { Container, Row, Col, Button, Table, Modal } from "react-bootstrap";

import "../../../css/Marketing_Administrator/Study@SIM.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faEdit, faTrashAlt } from "@fortawesome/free-regular-svg-icons";

import NavBar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import SideNavBar from "../../../components/SideNavbar";
import AddStudySIMProgModal from "../../../components/Marketing_Administrator/Study@SIM/AddStudySIMProgModal";
import EditStudySIMProgModal from "../../../components/Marketing_Administrator/Study@SIM/EditStudySIMProgModal";
import DeleteStudySIMProgModal from "../../../components/Marketing_Administrator/Study@SIM/DeleteStudySIMProgModal";
import ViewStudySIMProgDetailsModal from "../../../components/Marketing_Administrator/Study@SIM/ViewStudySIMProgDetailsModal";


class StudySIM_ArtsSocialSciences extends Component {
  constructor() {
    super();
    this.state = {
      programmes: [],
      disciplines: [],
      subDiscplines: [],
      universities: [],
      academicLvls: [],
      addStudySIMProgModal: false,
      editStudySIMProgModal: false,
      deleteStudySIMProgModal: false,
      viewStudySIMProgDetailsModal: false,
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
              this.fetchData();
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

  componentDidMount() {
    this.authListener();
  }

  fetchData = async () => {
    const db = fire.firestore();

    await db.collection("Programmes").onSnapshot((snapshot) => {
      const artsocialscience = [];
      snapshot.forEach((doc) => {
        const getdiscipline = doc.get("discipline");
        if (getdiscipline.disciplineName1 === "Arts & Social Sciences" || getdiscipline.disciplineName2 === "Arts & Social Sciences") {
          function getKeyByValue(object, value) {
            return Object.keys(object).find((key) => object[key] === value);
          }

          var disciplinepath = "discipline." + getKeyByValue(getdiscipline, "Arts & Social Sciences");

          const data = {
            docid: doc.id,
            programmeName: doc.data().programmeTitle,
            awardBy: doc.data().awardedBy,
            Logofile: doc.data().logoUrl,
            CategoryProgramme: doc.data().category,
            ModeOfStudy: doc.data().modeOfStudy,
            discipline1: doc.data().discipline.disciplineName1,
            discipline2: doc.data().discipline.disciplineName2,
            disciplinepath: disciplinepath,
            AcademicLevel: doc.data().academicLevel,
            Qualification: doc.data().entryQualifications,

            subDiscipline: doc.data().subDiscipline,

            aboutprogramme: doc.data().programmeOverview,
            applicationperiod: doc.data().applicationPeriod,
            programmestructure: doc.data().programmeStructure,
            overseaopportunity: doc.data().overseaOpportunity,
            intakemonths: doc.data().intakeMonths,
            duration: doc.data().duration,
          };

          artsocialscience.push(data);
        }
      });

      this.setState({ artsocialscience: artsocialscience });
    });

    const disciplines = []
    await db.collection('Disciplines').get().then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        const data = doc.data()
        disciplines.push(data.name)
      })
      this.setState({ disciplines: disciplines })
    })

    const subDisciplines = []
    await db.collection('SubDisciplines').get().then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        const data = doc.data()
        subDisciplines.push(data.name)
      })
      this.setState({ subDisciplines: subDisciplines })
    })

    const universities = []
    await db.collection('Universities').get().then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        const data = doc.data()
        universities.push(data.universityName)
      })
      this.setState({ universities: universities })
    })

    const academicLvls = []
    await db.collection('AcademicLevels').get().then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        const data = doc.data()
        academicLvls.push(data.level)
      })
      this.setState({ academicLvls: academicLvls })
    })

  }

  /* Add Programme Talk Modal */
  handleAddStudySIMProgModal = () => {
    if (this.state.addStudySIMProgModal == false) {
      this.setState({
        addStudySIMProgModal: true,
        addProgramme: "addProgramme"
      });
    } else {
      this.setState({
        addStudySIMProgModal: false
      });
    }
  };

  /* Edit Programme Talk Modal */
  handleEditStudySIMProgModal = () => {
    if (this.state.editStudySIMProgModal == false) {
      this.setState({
        editStudySIMProgModal: true
      });
    } else {
      this.setState({
        editStudySIMProgModal: false
      });
    }
  };

  /* Delete Programme Modal */
  handleDeleteStudySIMProgModal = () => {
    if (this.state.deleteStudySIMProgModal == false) {
      this.setState({
        deleteStudySIMProgModal: true
      });
    } else {
      this.setState({
        deleteStudySIMProgModal: false
      });
    }
  };

  /* View Programme Details Modal */
  handleViewStudySIMProgDetailsModal = () => {
    if (this.state.viewStudySIMProgDetailsModal == false) {
      this.setState({
        viewStudySIMProgDetailsModal: true
      });
    } else {
      this.setState({
        viewStudySIMProgDetailsModal: false
      });
    }
  };


  render() {
    return (
      <div>
        <Container fluid className="MAStudySIMCon">
          <NavBar isMA={true} />

          <Container fluid className="MAStudySIMContent">
            <Row>
              {/* SideNavBar Col */}
              <Col md="2" style={{ paddingRight: "0" }} className="sideNavBarCol">
                <SideNavBar />
              </Col>

              {/* Contents Col */}
              <Col md="10" style={{ paddingLeft: "0" }}>
                <Container fluid className="MAStudySIMContentCon">
                  {/* Study@SIM Page Header row */}
                  <Row className="justify-content-center MAStudySIMContentHeaderRow">
                    <Col md="6" className="text-left MAStudySIMContentHeaderCol">
                      <h4 className="MAStudySIMHeaderText">Programmes for Art & Social Science</h4>
                    </Col>

                    <Col md="6" className="text-right MAStudySIMContentHeaderCol">
                      <Button className="addStudySIMProgBtn" onClick={this.handleAddStudySIMProgModal}>
                        <FontAwesomeIcon size="lg" className="addStudySIMProgBtnIcon" icon={faPlus} />
                        <span className="addStudySIMProgBtnText">Add</span>
                      </Button>
                    </Col>
                  </Row>

                  {/* Table Row */}
                  <Row className="justify-content-center MAStudySIMTableRow">
                    <Col md="12" className="text-center">
                      <Table responsive="sm" hover bordered className="MAStudySIMTable">
                        <thead>
                          <tr>
                            <th className="studySIMProgHeader_SNo">S/N</th>
                            <th className="studySIMProgHeader_ProgName">Programme Name</th>
                            <th className="studySIMProgHeader_AwardedBy">Awarded By</th>
                            <th className="studySIMProgHeader_LogoFile">Logo File</th>
                            <th className="studySIMProgHeader_AcademicLvl">Academic Level</th>
                            <th className="studySIMProgHeader_MoS">Mode of Study</th>
                            <th className="studySIMProgHeader_Discipline">Disciplines</th>
                            <th className="studySIMProgHeader_EntryQual">Entry Qualifications</th>
                            <th className="studySIMProgHeader_SubDiscipline">Sub-Disciplines</th>
                            <th className="studySIMProgHeader_Edit">Edit</th>
                            <th className="studySIMProgHeader_Delete">Delete</th>
                          </tr>
                        </thead>
                        
                        
                        <tbody>
                          {this.state.artsocialscience && this.state.artsocialscience.map((artsocialscience, index) => {
                            index = index + 1;
                            return (
                              <tr key={index}>
                                <td className="studySIMProgData_SNo text-center">{index}</td>
                                <td className="studySIMProgData_ProgName text-left">
                                  <a className="studySIMProgData_ProgNameLink" onClick={() => {
                                      this.setState({
                                        programmeName: artsocialscience.programmeName,
                                        aboutprogramme1: artsocialscience.aboutprogramme.aboutProgramme1,
                                        aboutprogramme2: artsocialscience.aboutprogramme.aboutProgramme2,
                                        aboutprogramme3: artsocialscience.aboutprogramme.aboutProgramme3,
                                        applicationperiod1: artsocialscience.applicationperiod.period1,
                                        applicationperiod2: artsocialscience.applicationperiod.period2,
                                        programmestructurecoursework: artsocialscience.programmestructure.coursework,
                                        programmestructureexamination: artsocialscience.programmestructure.examination,
                                        overseaopportunityexchange: artsocialscience.overseaopportunity.exchange,
                                        overseaopportunitytransfer: artsocialscience.overseaopportunity.transfer,
                                        intakemonthsfulltime: artsocialscience.intakemonths.fullTime,
                                        intakemonthsparttime: artsocialscience.intakemonths.partTime,
                                        durationfulltime: artsocialscience.duration.fullTime,
                                        durationparttime: artsocialscience.duration.partTime,
                                      });
                                      this.handleViewStudySIMProgDetailsModal();
                                    }}
                                  >
                                    {artsocialscience.programmeName}
                                  </a>
                                </td>

                                <td className="studySIMProgData_AwardedBy text-left">{artsocialscience.awardBy}</td>

                                <td className="studySIMProgData_LogoFile text-left">
                                  <img src={artsocialscience.Logofile} className="logoFileImg" alt="No Logo file"></img>
                                </td>

                                <td className="studySIMProgData_AcademicLvl text-left">{artsocialscience.AcademicLevel}</td>
                                
                                <td className="studySIMProgData_MoS text-left">
                                  {artsocialscience.ModeOfStudy.fullTime === true && (
                                    <Row className="justify-content-center">
                                      <Col className="text-left">- Full-Time</Col>
                                    </Row>
                                  )}
                                    
                                  {artsocialscience.ModeOfStudy.partTime === true && (
                                    <Row className="justify-content-center">
                                      <Col className="text-left">- Part-Time</Col>
                                    </Row>
                                  )}
                                </td>

                                <td className="studySIMProgData_Discipline text-left">
                                  <Row className="justify-content-center">
                                    <Col className="text-left">{artsocialscience.discipline1}</Col>
                                  </Row>

                                  <Row className="justify-content-center">
                                    <Col className="text-left">{artsocialscience.discipline2}</Col>
                                  </Row>
                                </td>

                                <td className="studySIMProgData_EntryQual text-left">
                                  {artsocialscience.Qualification.aLevel === true && (
                                    <Row className="justify-content-center">
                                      <Col className="text-left">- "A" Level</Col>
                                    </Row>
                                  )}

                                  {artsocialscience.Qualification.degree === true && (
                                    <Row className="justify-content-center">
                                      <Col className="text-left">- Degree</Col>
                                    </Row>
                                  )}

                                  {artsocialscience.Qualification.diploma === true && (
                                    <Row className="justify-content-center">
                                      <Col className="text-left">- Diploma</Col>
                                    </Row>
                                  )}

                                  {artsocialscience.Qualification.oLevel === true && (
                                    <Row className="justify-content-center">
                                      <Col className="text-left">- "O" Level</Col>
                                    </Row>
                                  )}
                                </td>

                                <td className="studySIMProgData_SubDiscipline text-left">
                                  <Row className="justify-content-center">
                                    <Col className="text-left">{artsocialscience.subDiscipline.subDisciplineName1}</Col>
                                  </Row>

                                  <Row className="justify-content-center">
                                    <Col className="text-left">{artsocialscience.subDiscipline.subDisciplineName2}</Col>
                                  </Row>

                                  <Row className="justify-content-center">
                                    <Col className="text-left">{artsocialscience.subDiscipline.subDisciplineName3}</Col>
                                  </Row>
                                  
                                  <Row className="justify-content-center">
                                    <Col className="text-left">{artsocialscience.subDiscipline.subDisciplineName4}</Col>
                                  </Row>
                                  
                                  <Row className="justify-content-center">
                                    <Col className="text-left">{artsocialscience.subDiscipline.subDisciplineName5}</Col>
                                  </Row>
                                </td>

                                <td className="studySIMProgData_Edit text-center">
                                  <Button className="editStudySIMProgBtn" onClick={() => {
                                    this.setState({
                                      programmeName: artsocialscience.programmeName,
                                      University: artsocialscience.awardBy,
                                      category: artsocialscience.CategoryProgramme,
                                      ModeOfStudy: artsocialscience.ModeOfStudy,
                                      discipline1: artsocialscience.discipline1,
                                      discipline2: artsocialscience.discipline2,
                                      academiclevel: artsocialscience.AcademicLevel,
                                      olevel: artsocialscience.Qualification.oLevel,
                                      aLevel: artsocialscience.Qualification.aLevel,
                                      degree: artsocialscience.Qualification.degree,
                                      diploma: artsocialscience.Qualification.diploma,
                                      subdiscipline1: artsocialscience.subDiscipline.subDisciplineName1,
                                      subdiscipline2: artsocialscience.subDiscipline.subDisciplineName2,
                                      subdiscipline3: artsocialscience.subDiscipline.subDisciplineName3,
                                      subdiscipline4: artsocialscience.subDiscipline.subDisciplineName4,
                                      subdiscipline5: artsocialscience.subDiscipline.subDisciplineName5,
                                          
                                      //details
                                      aboutprogramme1: artsocialscience.aboutprogramme.aboutProgramme1,
                                      aboutprogramme2: artsocialscience.aboutprogramme.aboutProgramme2,
                                      aboutprogramme3: artsocialscience.aboutprogramme.aboutProgramme3,
                                      applicationperiod1: artsocialscience.applicationperiod.period1,
                                      applicationperiod2: artsocialscience.applicationperiod.period2,
                                      programmestructurecoursework: artsocialscience.programmestructure.coursework,
                                      programmestructureexamination: artsocialscience.programmestructure.examination,
                                      overseaopportunityexchange: artsocialscience.overseaopportunity.exchange,
                                      overseaopportunitytransfer: artsocialscience.overseaopportunity.transfer,
                                      intakemonthsfulltime: artsocialscience.intakemonths.fullTime,
                                      intakemonthsparttime: artsocialscience.intakemonths.partTime,
                                      durationfulltime: artsocialscience.duration.fullTime,
                                      durationparttime: artsocialscience.duration.partTime,
                                      docid: artsocialscience.docid,
                                      });
                                      this.handleEditStudySIMProgModal();
                                    }}
                                  >
                                    <FontAwesomeIcon size="lg" className="editStudySIMProgBtnIcon" icon={faEdit} />
                                  </Button>
                                </td>

                                <td className="studySIMProgData_Delete text-center">
                                  <Button className="deleteStudySIMProgBtn" onClick={() => {
                                      this.setState({docid: artsocialscience.docid}); 
                                      this.handleDeleteStudySIMProgModal();
                                    }}
                                  >
                                    <FontAwesomeIcon size="lg" className="deleteStudySIMProgBtnIcon" icon={faTrashAlt} />
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                          
                      </Table>
                    </Col>
                  </Row>
                </Container>
              </Col>
            </Row>
          </Container>

          <Footer />
        </Container>


        {/* Add Programme Modal */}
        <Modal
          show={this.state.addStudySIMProgModal}
          onHide={this.handleAddStudySIMProgModal}
          aria-labelledby="addStudySIMProgModalTitle"
          size="xl"
          centered
          backdrop="static"
          keyboard={false}
          className="addStudySIMProgModal"
        >
          <AddStudySIMProgModal handleAdd={() => { this.handleAddStudySIMProgModal() }}
            universities={this.state.universities}
            disciplines={this.state.disciplines}
            subDisciplines={this.state.subDisciplines}
            academicLvls={this.state.academicLvls}
          />
        </Modal>


        {/* Edit Programme Modal */}
        <Modal
          show={this.state.editStudySIMProgModal}
          onHide={this.handleEditStudySIMProgModal}
          aria-labelledby="editStudySIMProgModalTitle"
          size="xl"
          centered
          backdrop="static"
          keyboard={false}
          className="editStudySIMProgModal"
        >
          <EditStudySIMProgModal
            programmeName={this.state.programmeName}
            University={this.state.University}
            // category={this.state.category}
            logoUrl={this.state.Logofile}
            ModeOfStudy={this.state.ModeOfStudy}
            discipline1={this.state.discipline1}
            discipline2={this.state.discipline2}
            academiclevel={this.state.academiclevel}
            olevel={this.state.olevel}
            aLevel={this.state.aLevel}
            degree={this.state.degree}
            diploma={this.state.diploma}
            subdiscipline1={this.state.subdiscipline1}
            subdiscipline2={this.state.subdiscipline2}
            subdiscipline3={this.state.subdiscipline3}
            subdiscipline4={this.state.subdiscipline4}
            subdiscipline5={this.state.subdiscipline5}

            //details
            aboutprogramme1={this.state.aboutprogramme1}
            aboutprogramme2={this.state.aboutprogramme2}
            aboutprogramme3={this.state.aboutprogramme3}
            applicationperiod1={this.state.applicationperiod1}
            applicationperiod2={this.state.applicationperiod2}
            programmestructurecoursework={this.state.programmestructurecoursework}
            programmestructureexamination={this.state.programmestructureexamination}
            overseaopportunityexchange={this.state.overseaopportunityexchange}
            overseaopportunitytransfer={this.state.overseaopportunitytransfer}
            intakemonthsfulltime={this.state.intakemonthsfulltime}
            intakemonthsparttime={this.state.intakemonthsparttime}
            durationfulltime={this.state.durationfulltime}
            durationparttime={this.state.durationparttime}
            docid={this.state.docid}

            // List of options from DB
            universities = {this.state.universities}
            disciplines = {this.state.disciplines}
            subDisciplines = {this.state.subDisciplines}

            // Button props
            handleSaveChanges={() => {this.handleEditStudySIMProgModal()}}
            handleCancelEdit={this.handleEditStudySIMProgModal}
            academicLvls={this.state.academicLvls}
          />
        </Modal>


        {/* Delete Programme Talk Modal */}
        <Modal
          show={this.state.deleteStudySIMProgModal}
          onHide={this.handleDeleteStudySIMProgModal}
          aria-labelledby="deleteStudySIMProgModalTitle"
          size="md"
          centered
          backdrop="static"
          keyboard={false}
        >
          <DeleteStudySIMProgModal docid={this.state.docid} handleConfirmDelete={() => {this.handleDeleteStudySIMProgModal();}} handleCancelDelete={this.handleDeleteStudySIMProgModal} />
        </Modal>


        {/* View Programme Details Modal */}
        <Modal
          show={this.state.viewStudySIMProgDetailsModal}
          onHide={this.handleViewStudySIMProgDetailsModal}
          aria-labelledby="viewStudySIMProgDetailsModalTitle"
          size="xl"
          centered
          backdrop="static"
          keyboard={false}
        >
          <ViewStudySIMProgDetailsModal
            programmeName={this.state.programmeName}
            aboutprogramme1={this.state.aboutprogramme1}
            aboutprogramme2={this.state.aboutprogramme2}
            aboutprogramme3={this.state.aboutprogramme3}
            applicationperiod1={this.state.applicationperiod1}
            applicationperiod2={this.state.applicationperiod2}
            programmestructurecoursework={this.state.programmestructurecoursework}
            programmestructureexamination={this.state.programmestructureexamination}
            overseaopportunityexchange={this.state.overseaopportunityexchange}
            overseaopportunitytransfer={this.state.overseaopportunitytransfer}
            intakemonthsfulltime={this.state.intakemonthsfulltime}
            intakemonthsparttime={this.state.intakemonthsparttime}
            durationfulltime={this.state.durationfulltime}
            durationparttime={this.state.durationparttime}
            aboutprogramme1={this.state.aboutprogramme1}
            aboutprogramme2={this.state.aboutprogramme2}
            aboutprogramme3={this.state.aboutprogramme3}
            applicationperiod1={this.state.applicationperiod1}
            applicationperiod2={this.state.applicationperiod2}
            programmestructurecoursework={this.state.programmestructurecoursework}
            programmestructureexamination={this.state.programmestructureexamination}
            overseaopportunityexchange={this.state.overseaopportunityexchange}
            overseaopportunitytransfer={this.state.overseaopportunitytransfer}
            intakemonthsfulltime={this.state.intakemonthsfulltime}
            intakemonthsparttime={this.state.intakemonthsparttime}
            durationfulltime={this.state.durationfulltime}
            durationparttime={this.state.durationparttime}
          />
        </Modal>
      </div>
    );
  }
}

export default StudySIM_ArtsSocialSciences;
