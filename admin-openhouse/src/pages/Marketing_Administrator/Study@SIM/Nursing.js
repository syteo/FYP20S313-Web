import React, { Component } from "react";
import fire from "../../../config/firebase";
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


class StudySIM_Nursing extends Component {
  constructor() {
    super();
    this.state = {
      addStudySIMProgModal: false,
      editStudySIMProgModal: false,
      deleteStudySIMProgModal: false,
      viewStudySIMProgDetailsModal: false
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

  componentDidMount() {
    this.authListener();
  }
  display() {
    const db = fire.firestore();

    const userRe1 = db.collection("Programmes").onSnapshot((snapshot) => {
      const nursing = [];
      snapshot.forEach((doc) => {
        const getdiscipline = doc.get("discipline");
        if (
          getdiscipline.disciplineName1 === "Nursing" ||
          getdiscipline.disciplineName2 === "Nursing"
        ) {
          function getKeyByValue(object, value) {
            return Object.keys(object).find((key) => object[key] === value);
          }

          var disciplinepath =
            "discipline." + getKeyByValue(getdiscipline, "Nursing");

          const data = {
            docid: doc.id,
            programmeName: doc.data().programmeTitle,
            awardBy: doc.data().awardedBy,
            Logofile: doc.data().Logofile,
            CategoryProgramme: doc.data().category,
            ModeOfStudy: doc.data().modeOfStudy,
            discipline1: doc.data().discipline.disciplineName1,
            discipline2: doc.data().discipline.disciplineName2,
            disciplinepath: disciplinepath,
            AcademicLevel: doc.data().academicLevel,
            Qualificaiton: doc.data().entryQualifications,

            subDiscipline: doc.data().subDiscipline,
          };

          nursing.push(data);
        }
      });

      this.setState({ nursing: nursing });
    });
  }
  /* Add Programme Talk Modal */
  handleAddStudySIMProgModal = () => {
    if (this.state.addStudySIMProgModal == false) {
      this.setState({
        addStudySIMProgModal: true,
        test: "test",
      });
    } else {
      this.setState({
        addStudySIMProgModal: false,
      });
    }
  };

  /* Edit Programme Talk Modal */
  handleEditStudySIMProgModal = () => {
    if (this.state.editStudySIMProgModal == false) {
      this.setState({
        editStudySIMProgModal: true,
      });
    } else {
      this.setState({
        editStudySIMProgModal: false,
      });
    }
  };

  /* Delete Programme Modal */
  handleDeleteStudySIMProgModal = () => {
    if (this.state.deleteStudySIMProgModal == false) {
      this.setState({
        deleteStudySIMProgModal: true,
      });
    } else {
      this.setState({
        deleteStudySIMProgModal: false,
      });
    }
  };

  /* View Programme Details Modal */
  handleViewStudySIMProgDetailsModal = () => {
    if (this.state.viewStudySIMProgDetailsModal == false) {
      this.setState({
        viewStudySIMProgDetailsModal: true,
      });
    } else {
      this.setState({
        viewStudySIMProgDetailsModal: false,
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
              <Col
                md="2"
                style={{ paddingRight: "0" }}
                className="sideNavBarCol"
              >
                <SideNavBar />
              </Col>

              {/* Contents Col */}
              <Col md="10" style={{ paddingLeft: "0" }}>
                <Container fluid className="MAStudySIMContentCon">
                  {/* Study@SIM Page Header row */}
                  <Row className="justify-content-center MAStudySIMContentHeaderRow">
                    <Col
                      md="6"
                      className="text-left MAStudySIMContentHeaderCol"
                    >
                      <h4 className="MAStudySIMHeaderText">
                        Programmes for Nursing
                      </h4>
                    </Col>

                    <Col
                      md="6"
                      className="text-right MAStudySIMContentHeaderCol"
                    >
                      <Button
                        className="addStudySIMProgBtn"
                        onClick={this.handleAddStudySIMProgModal}
                      >
                        <FontAwesomeIcon
                          size="lg"
                          className="addStudySIMProgBtnIcon"
                          icon={faPlus}
                        />
                        <span className="addStudySIMProgBtnText">Add</span>
                      </Button>
                    </Col>
                  </Row>

                  {/* Table Row */}
                  <Row className="justify-content-center MAStudySIMTableRow">
                    <Col md="12" className="text-center">
                      <Table
                        responsive="sm"
                        hover
                        bordered
                        className="MAStudySIMTable"
                      >
                        <thead>
                          <tr>
                            <th className="studySIMProgHeader_SNo">S/N</th>
                            <th className="studySIMProgHeader_ProgName">
                              Programme Name
                            </th>
                            <th className="studySIMProgHeader_AwardedBy">
                              Awarded By
                            </th>
                            <th className="studySIMProgHeader_LogoFile">
                              Logo File
                            </th>
                            <th className="studySIMProgHeader_Category">
                              Category
                            </th>
                            <th className="studySIMProgHeader_MoS">
                              Mode of Study
                            </th>
                            <th className="studySIMProgHeader_Discipline">
                              Disciplines
                            </th>
                            <th className="studySIMProgHeader_AcademicLvl">
                              Academic Level
                            </th>
                            <th className="studySIMProgHeader_EntryQual">
                              Entry Qualifications
                            </th>
                            <th className="studySIMProgHeader_SubDiscipline">
                              Sub-Disciplines
                            </th>
                            <th className="studySIMProgHeader_Edit">Edit</th>
                            <th className="studySIMProgHeader_Delete">
                              Delete
                            </th>
                          </tr>
                        </thead>
                        {this.state.nursing &&
                          this.state.nursing.map((nursing, index) => {
                            index = index + 1;
                            return (
                              <tbody>
                                <tr>
                                  <td className="studySIMProgData_SNo text-center">
                                    {index}
                                  </td>
                                  <td className="studySIMProgData_ProgName text-left">
                                    <a className="studySIMProgData_ProgNameLink" onClick={this.handleViewStudySIMProgDetailsModal}>
                                      {/* href={
                                        "/ArtsSocialScienceViewProgramme?id=" +
                                        nursing.docid
                                      } */}
                                      {nursing.programmeName}
                                    </a>
                                  </td>
                                  <td className="studySIMProgData_AwardedBy text-left">
                                    {nursing.awardBy}
                                  </td>
                                  <td className="studySIMProgData_LogoFile text-left">
                                    {nursing.Logofile}
                                  </td>
                                  <td className="studySIMProgData_Category text-left">
                                    {nursing.CategoryProgramme}
                                  </td>
                                  <td className="studySIMProgData_MoS text-left">
                                    <tr>
                                      {nursing.ModeOfStudy.fullTime ===
                                        true && <span>Full-Time</span>}
                                    </tr>
                                    <tr>
                                      {nursing.ModeOfStudy.partTime ===
                                        true && <span>Part-Time</span>}
                                    </tr>
                                  </td>
                                  <td className="studySIMProgData_Discipline text-left">
                                    <tr>{nursing.discipline1}</tr>
                                    <tr>{nursing.discipline2}</tr>
                                  </td>
                                  <td className="studySIMProgData_AcademicLvl text-left">
                                    {nursing.AcademicLevel}
                                  </td>
                                  <td className="studySIMProgData_EntryQual text-left">
                                    <tr>
                                      {nursing.Qualificaiton.aLevel ===
                                        true && <span>"A" level</span>}
                                    </tr>
                                    <tr>
                                      {nursing.Qualificaiton.degree ===
                                        true && <span>Degree</span>}
                                    </tr>
                                    <tr>
                                      {nursing.Qualificaiton.diploma ===
                                        true && <span>Diploma</span>}
                                    </tr>
                                    <tr>
                                      {nursing.Qualificaiton.oLevel ===
                                        true && <span>"O" Level</span>}
                                    </tr>
                                  </td>
                                  <td className="studySIMProgData_SubDiscipline text-left">
                                    <tr>
                                      {nursing.subDiscipline.subDisciplineName1}
                                    </tr>
                                    <tr>
                                      {nursing.subDiscipline.subDisciplineName2}
                                    </tr>
                                    <tr>
                                      {nursing.subDiscipline.subDisciplineName3}
                                    </tr>
                                    <tr>
                                      {nursing.subDiscipline.subDisciplineName4}
                                    </tr>
                                    <tr>
                                      {nursing.subDiscipline.subDisciplineName5}
                                    </tr>
                                  </td>
                                  <td className="studySIMProgData_Edit text-center">
                                    <Button
                                      className="editStudySIMProgBtn"
                                      onClick={() => {
                                        this.setState({
                                          programmeName: nursing.programmeName,
                                          University: nursing.awardBy,
                                          category: nursing.CategoryProgramme,
                                          ModeOfStudy: nursing.ModeOfStudy,
                                          discipline1: nursing.discipline1,
                                          discipline2: nursing.discipline2,
                                          acadamiclevel: nursing.AcademicLevel,
                                          olevel: nursing.Qualificaiton.oLevel,
                                          aLevel: nursing.Qualificaiton.aLevel,
                                          degree: nursing.Qualificaiton.degree,
                                          diploma:
                                            nursing.Qualificaiton.diploma,
                                          subdisciplne1:
                                            nursing.subDiscipline
                                              .subDisciplineName1,
                                          subdisciplne2:
                                            nursing.subDiscipline
                                              .subDisciplineName2,
                                          subdisciplne3:
                                            nursing.subDiscipline
                                              .subDisciplineName3,
                                          subdisciplne4:
                                            nursing.subDiscipline
                                              .subDisciplineName4,
                                          subdisciplne4:
                                            nursing.subDiscipline
                                              .subDisciplineName4,
                                        });
                                        this.handleEditStudySIMProgModal();
                                      }}
                                    >
                                      <FontAwesomeIcon
                                        size="lg"
                                        className="editStudySIMProgBtnIcon"
                                        icon={faEdit}
                                      />
                                    </Button>
                                  </td>
                                  <td className="studySIMProgData_Delete text-center">
                                    <Button
                                      className="deleteStudySIMProgBtn"
                                      onClick={() => {
                                        this.setState({
                                          docid: nursing.docid,
                                        });
                                        this.handleDeleteStudySIMProgModal();
                                      }}
                                    >
                                      <FontAwesomeIcon
                                        size="lg"
                                        className="deleteStudySIMProgBtnIcon"
                                        icon={faTrashAlt}
                                      />
                                    </Button>
                                  </td>
                                </tr>
                              </tbody>
                            );
                          })}
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
          <AddStudySIMProgModal />
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
            category={this.state.category}
            ModeOfStudy={this.state.ModeOfStudy}
            discipline1={this.state.discipline1}
            discipline2={this.state.discipline2}
            acadamiclevel={this.state.acadamiclevel}
            olevel={this.state.olevel}
            aLevel={this.state.aLevel}
            degree={this.state.degree}
            diploma={this.state.diploma}
            subdisciplne1={this.state.subdisciplne1}
            subdisciplne2={this.state.subdisciplne2}
            subdisciplne3={this.state.subdisciplne3}
            subdisciplne4={this.state.subdisciplne4}
            subdisciplne5={this.state.subdisciplne5}
            handleSaveChanges={() => {
              console.log("Edit Modal Saved");
            }}
            handleCancelEdit={this.handleEditStudySIMProgModal}
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
          <DeleteStudySIMProgModal
            docid={this.state.docid}
            handleConfirmDelete={() => {
              this.handleDeleteStudySIMProgModal();
            }}
            handleCancelDelete={this.handleDeleteStudySIMProgModal}
          />
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
          <ViewStudySIMProgDetailsModal />
        </Modal>
      </div>
    );
  }
}
export default StudySIM_Nursing;
