import React from "react";
import { Modal, Form, Button, Row, Col, FormControl, Container, InputGroup } from "react-bootstrap";

import { db, storage } from "../../../config/firebase";
import history from "../../../config/history";

import "../../../css/Marketing_Administrator/AddStudySIMProgModal.css";


const initialStates = {
  progNameError: "",
  logoFileError: "",
  universityError: "",
  academicLevelError: "",
  modeOfStudyError: "",
  disciplineError: "",
  entryQualError: "",
  subDisciplineError: "",
  aboutProgError: "",
  applicationPeriodError: "",
  intakeMonthsError: "",
  durationError: ""
}

export default class AddStudySIMProgModal extends React.Component {
  state = initialStates;
  
  constructor(props) {
    super(props);

    this.state = {
      docid: "",
      handleAdd: "",

      disciplinecheckedItems: [],
      subdisciplinecheckedItems: [],
      entryqualificationcheckedItems: [],
      programme: "",
      university: "",
      category: "",
      academiclevel: "",
      parttime: "",
      fulltime: "",
      diploma: "",
      degree: "",
      alevel: "",
      olevel: "",

      //details
      aboutprogramme1: "",
      aboutprogramme2: "",
      aboutprogramme3: "",
      applicationperiod1: "",
      applicationperiod2: "",
      durationfulltime: "",
      durationparttime: "",
      intakemonthsfulltime: "",
      intakemonthsparttime: "",
      overseaopportunityexchange: "",
      overseaopportunitytransfer: "",
      programmestructurecoursework: "",
      programmestructureexamination: "",
    };
    this.DisciplinehandleChange = this.DisciplinehandleChange.bind(this);
    this.SubDisciplinehandleChange = this.SubDisciplinehandleChange.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  componentDidMount() {
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    const University = [];
    // const Category = [];
    const Modeofstudy = [];
    const Discipline = [];
    const AcademicLevel = [];
    const entryQual = [];
    const subDiscipline = [];
    const subDiscipline2 = [];

    const Universityquery = db
    .collection("TestProgrammes")
    .onSnapshot((snapshot) => {
      snapshot.forEach((doc) => {
        University.push(doc.data().awardedBy);
        // Category.push(doc.data().category);
        Modeofstudy.push(doc.data().modeOfStudy);
        Discipline.push(doc.data().discipline.disciplineName1);
        Discipline.push(doc.data().discipline.disciplineName2);
        AcademicLevel.push(doc.data().academicLevel);
        entryQual.push(doc.data().entryQualifications);
        subDiscipline.push(doc.data().subDiscipline.subDisciplineName1);
        subDiscipline.push(doc.data().subDiscipline.subDisciplineName2);
        subDiscipline.push(doc.data().subDiscipline.subDisciplineName3);
        subDiscipline.push(doc.data().subDiscipline.subDisciplineName4);
        subDiscipline.push(doc.data().subDiscipline.subDisciplineName5);
        subDiscipline2.push(doc.id);
        subDiscipline2.push(doc.data().discipline);
      });

      //   var unique = University.filter(onlyUnique);
      var uniqueUniversity = University.filter(onlyUnique);
      // var uniqueCategory = Category.filter(onlyUnique);
      var uniqueDiscipline = Discipline.filter(onlyUnique);
      var uniqueAcademicLevel = AcademicLevel.filter(onlyUnique);
      var uniquesubDiscipline = subDiscipline.filter(onlyUnique);

      let uniqueentryQuals = Object.keys(Object.assign({}, ...entryQual));
      let uniqueModeofstudy = Object.keys(Object.assign({}, ...Modeofstudy));
      console.log(uniqueModeofstudy);

      //remove undefined
      uniqueUniversity = uniqueUniversity.filter((val) => val !== undefined);
      uniqueUniversity = uniqueUniversity.filter((val) => val !== "");
      // uniqueCategory = uniqueCategory.filter((val) => val !== undefined);
      // uniqueCategory = uniqueCategory.filter((val) => val !== "");

      uniqueDiscipline = uniqueDiscipline.filter((val) => val !== undefined);
      uniqueDiscipline = uniqueDiscipline.filter((val) => val !== "");
      uniqueAcademicLevel = uniqueAcademicLevel.filter((val) => val !== undefined);
      uniqueAcademicLevel = uniqueAcademicLevel.filter((val) => val !== "");

      uniquesubDiscipline = uniquesubDiscipline.filter((val) => val !== undefined);
      uniquesubDiscipline = uniquesubDiscipline.filter((val) => val !== "");
        
      this.setState({
        University: uniqueUniversity,
        // Category: uniqueCategory,
        Modeofstudy: uniqueModeofstudy,
        Discipline: uniqueDiscipline,
        AcademicLevel: uniqueAcademicLevel,
        entryQual: uniqueentryQuals,
        subDiscipline: uniquesubDiscipline,
      });
    });
  }

  DisciplinehandleChange(event) {
    //console.log(event.target.checked);
    var x = document.getElementsByClassName("DisciplineCheckboxes");
    if (event.target.checked) {
      this.setState(
        {
          disciplinecheckedItems: [
            ...this.state.disciplinecheckedItems,
            event.target.value,
          ],
        },
        () => {
          // console.log(this.state.disciplinecheckedItems);

          var dis = this.state.disciplinecheckedItems;

          if (this.state.disciplinecheckedItems.length >= 2) {
            //console.log(x);
            for (var i = 0; i < x.length; i++) {
              if (Object.values(dis).includes(x[i].innerText)) {
                this.setState({
                  [x[i].innerText]: false,
                });
              } else {
                this.setState({
                  [x[i].innerText]: true,
                });
              }
            }
          }
        }
      );
    } else {
      let remove = this.state.disciplinecheckedItems.indexOf(event.target.value);

      this.setState(
        {
          disciplinecheckedItems: this.state.disciplinecheckedItems.filter((_, i) => i !== remove)
        },
        () => {
          // console.log(this.state.disciplinecheckedItems);
          if (this.state.disciplinecheckedItems.length <= 2) {
            for (var i = 0; i < x.length; i++) {
              this.setState({
                [x[i].innerText]: false,
              });
            }
          }
        }
      );
    }
  }

  SubDisciplinehandleChange(event) {
    var x = document.getElementsByClassName("subDisciplineCheckboxes");
    if (event.target.checked) {
      this.setState(
        {
          subdisciplinecheckedItems: [
            ...this.state.subdisciplinecheckedItems,
            event.target.value
          ],
        },
        () => {
          //console.log(this.state.subdisciplinecheckedItems);

          var dis = this.state.subdisciplinecheckedItems;

          if (this.state.subdisciplinecheckedItems.length >= 5) {
            // console.log(x);
            for (var i = 0; i < x.length; i++) {
              if (Object.values(dis).includes(x[i].innerText)) {
                this.setState({
                  [x[i].innerText]: false
                });
              } else {
                this.setState({
                  ["sub" + x[i].innerText]: true
                });
              }
            }
          }
        }
      );
    } else {
      let remove = this.state.subdisciplinecheckedItems.indexOf(event.target.value);

      this.setState(
        {
          subdisciplinecheckedItems: this.state.subdisciplinecheckedItems.filter((_, i) => i !== remove)
        },
        () => {
          //console.log(this.state.subdisciplinecheckedItems);
          if (this.state.subdisciplinecheckedItems.length <= 5) {
            for (var i = 0; i < x.length; i++) {
              this.setState({
                ["sub" + x[i].innerText]: false,
              });
            }
          }
        }
      );
    }
  }

  handleChange = (e) => {
    console.log(e.target.name);
    console.log(e.target.value);
    this.setState({
      [e.target.name]: [e.target.value]
    });
    if (e.target.value === "partTime") {
      this.setState({
        parttime: e.target.checked
      });
    }

    if (e.target.value === "fullTime") {
      this.setState({
        fulltime: e.target.checked
      });
    }

    if (e.target.value === "diploma") {
      this.setState({
        diploma: e.target.checked
      });
    }

    if (e.target.value === "degree") {
      this.setState({
        degree: e.target.checked,
      });
    }

    if (e.target.value === "aLevel") {
      this.setState({
        alevel: e.target.checked
      });
    }

    if (e.target.value === "oLevel") {
      this.setState({
        olevel: e.target.checked
      });
    }

    if (e.target.value === "Coursework") {
      this.setState({
        programmestructurecoursework: e.target.checked
      });
    }

    if (e.target.value === "Examination") {
      this.setState({
        programmestructureexamination: e.target.checked
      });
    }

    if (e.target.value === "Exchange") {
      this.setState({
        overseaopportunityexchange: e.target.checked
      });
    }

    if (e.target.value === "Transfer") {
      this.setState({
        overseaopportunitytransfer: e.target.checked
      });
    }
  };

  addProgramme() {
    var a = this;

    var lastdoc = db
    .collection("Programmes")
    .orderBy("id", "desc")
    .limit(1)
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        var docid = "";

        var res = doc.data().id.substring(10);
        var id = parseInt(res);
        if (id.toString().length <= 1) {
          docid = "programme-00" + (id + 1);
        } else if (id.toString().length <= 2) {
          docid = "programme-0" + (id + 1);
        } else {
          docid = "programme-" + (id + 1);
        }
        this.setState(
          {
            docid: docid,
          },
          () => {
            this.add();
            console.log(this.state.docid);
          }
        );
      });
    });
  }

  add() {
    console.log(this.state.id);
    console.log("programme: " + this.state.programme);
    console.log("university: " + this.state.university);
    console.log("category: " + this.state.category);
    console.log("academiclevel: " + this.state.academiclevel);

    console.log("PT: " + this.state.parttime);
    console.log("FT: " + this.state.fulltime);
    console.log("alevel: " + this.state.alevel);
    console.log("degree: " + this.state.degree);
    console.log("diploma: " + this.state.diploma);
    console.log("olevel: " + this.state.olevel);
    //-----------------------------------------------------
    //console.log("discipline: " + this.state.disciplinecheckedItems);

    var discipline = this.state.disciplinecheckedItems;
    var discipline1 = "";
    var discipline2 = "";

    for (var index = 0; index < discipline.length; ++index) {
      if (index === 0) {
        discipline1 = discipline[index];
      }
      if (index === 1) {
        discipline2 = discipline[index];
      }
    }

    console.log(discipline1);
    console.log(discipline2);

    //------------------------------------------------------------------------------
    //console.log("subdiscipline: " + this.state.subdisciplinecheckedItems);

    var subdiscipline = this.state.subdisciplinecheckedItems;
    var subdiscipline1 = "";
    var subdiscipline2 = "";
    var subdiscipline3 = "";
    var subdiscipline4 = "";
    var subdiscipline5 = "";
    for (var index = 0; index < subdiscipline.length; ++index) {
      if (index === 0) {
        subdiscipline1 = subdiscipline[index];
      }
      if (index === 1) {
        subdiscipline2 = subdiscipline[index];
      }
      if (index === 2) {
        subdiscipline3 = subdiscipline[index];
      }
      if (index === 3) {
        subdiscipline4 = subdiscipline[index];
      }
      if (index === 4) {
        subdiscipline5 = subdiscipline[index];
      }
    }

    console.log(subdiscipline1);
    console.log(subdiscipline2);
    console.log(subdiscipline3);
    console.log(subdiscipline4);
    console.log(subdiscipline5);

    console.log("aboutprogramme1: " + this.state.aboutprogramme1);
    console.log("aboutprogramme2: " + this.state.aboutprogramme2);
    console.log("aboutprogramme3: " + this.state.aboutprogramme3);
    console.log("applicationperiod1: " + this.state.applicationperiod1);
    console.log("applicationperiod2: " + this.state.applicationperiod2);
    console.log("intakemonthsfulltime: " + this.state.intakemonthsfulltime);

    console.log("intakemonthspartimetime: " + this.state.intakemonthsparttime);
    console.log("durationfulltime: " + this.state.durationfulltime);
    console.log("durationparttime: " + this.state.durationparttime);

    console.log(
      "overseaopportunityexchange: " + this.state.overseaopportunityexchange
    );
    console.log(
      "overseaopportunitytransfer: " + this.state.overseaopportunitytransfer
    );
    console.log(
      "programmestructurecoursework: " + this.state.programmestructurecoursework
    );
    console.log(
      "programmestructureexamination: " + this.state.programmestructureexamination
    );

    const parentthis = this;
    if (this.state.files !== undefined) {
      const foldername = "Universities";
      const file = this.state.files[0];
      const storageRef = storage.ref(foldername);
      const fileRef = storageRef.child(file.name).put(file);
      fileRef.on("state_changed", function (snapshot) {
        fileRef.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          console.log(downloadURL);
          const userRef = db
          .collection("Programmes")
          .doc(parentthis.state.docid);
          
          // Validation
          const isValid = this.validate();
          if (isValid) {
            this.setState(initialStates);

            userRef.set({
              id: parentthis.state.docid,
              entryQualifications: {
                diploma: parentthis.state.diploma,
                oLevel: parentthis.state.olevel,
                degree: parentthis.state.degree,
                aLevel: parentthis.state.alevel
              },
              subDiscipline: {
                subDisciplineName1: subdiscipline1,
                subDisciplineName2: subdiscipline2,
                subDisciplineName3: subdiscipline3,
                subDisciplineName4: subdiscipline4,
                subDisciplineName5: subdiscipline5
              },
              logoFile: downloadURL,
              discipline: {
                disciplineName1: discipline1,
                disciplineName2: discipline2
              },
              programmeStructure: {
                coursework: parentthis.state.programmestructurecoursework,
                examination: parentthis.state.programmestructureexamination
              },
              awardedBy: parentthis.state.university.toString(),
              academicLevel: parentthis.state.academiclevel.toString(),
              intakeMonths: {
                fullTime: parentthis.state.intakemonthsfulltime.toString(),
                partTime: parentthis.state.intakemonthsparttime.toString()
              },
              duration: {
                partTime: parentthis.state.durationparttime.toString(),
                fullTime: parentthis.state.durationfulltime.toString()
              },
              applicationPeriod: {
                period1: parentthis.state.applicationperiod1.toString(),
                period2: parentthis.state.applicationperiod2.toString()
              },
              overseaOpportunity: {
                exchange: parentthis.state.overseaopportunityexchange,
                transfer: parentthis.state.overseaopportunitytransfer
              },
              programmeTitle: parentthis.state.programme.toString(),
              modeOfStudy: {
                partTime: parentthis.state.parttime,
                fullTime: parentthis.state.fulltime
              },
              category: parentthis.state.category.toString(),
              programmeOverview: {
                aboutProgramme1: parentthis.state.aboutprogramme1.toString(),
                aboutProgramme3: parentthis.state.aboutprogramme3.toString(),
                aboutProgramme2: parentthis.state.aboutprogramme2.toString()
              }
            })
            .then(dataSnapshot => {
              this.props.handleAdd();
            });
          }
        });

        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        if (progress != "100") {
          parentthis.setState({ progress: progress });
        } else {
          parentthis.setState({ progress: "Uploaded!" });
        }
      });
    } else {
      const userRef = db.collection("Programmes").doc(this.state.docid);
      const isValid = this.validate();

      if (isValid) {
        this.setState(initialStates);
        userRef.set({
          id: this.state.docid,
          entryQualifications: {
            diploma: parentthis.state.diploma,
            oLevel: parentthis.state.olevel,
            degree: parentthis.state.degree,
            aLevel: parentthis.state.alevel
          },
          subDiscipline: {
            subDisciplineName1: subdiscipline1,
            subDisciplineName2: subdiscipline2,
            subDisciplineName3: subdiscipline3,
            subDisciplineName4: subdiscipline4,
            subDisciplineName5: subdiscipline5
          },
          //"logoFile":downloadURL,
          discipline: {
            disciplineName1: discipline1,
            disciplineName2: discipline2
          },
          programmeStructure: {
            coursework: parentthis.state.programmestructurecoursework,
            examination: parentthis.state.programmestructureexamination
          },
          awardedBy: parentthis.state.university.toString(),
          academicLevel: parentthis.state.academiclevel.toString(),
          intakeMonths: {
            fullTime: parentthis.state.intakemonthsfulltime.toString(),
            partTime: parentthis.state.intakemonthsparttime.toString()
          },
          duration: {
            partTime: parentthis.state.durationparttime.toString(),
            fullTime: parentthis.state.durationfulltime.toString()
          },
          applicationPeriod: {
            period1: parentthis.state.applicationperiod1.toString(),
            period2: parentthis.state.applicationperiod2.toString()
          },
          overseaOpportunity: {
            exchange: parentthis.state.overseaopportunityexchange,
            transfer: parentthis.state.overseaopportunitytransfer
          },
          programmeTitle: parentthis.state.programme.toString(),
          modeOfStudy: {
            partTime: parentthis.state.parttime,
            fullTime: parentthis.state.fulltime
          },
          category: parentthis.state.category.toString(),
          programmeOverview: {
            aboutProgramme1: parentthis.state.aboutprogramme1.toString(),
            aboutProgramme3: parentthis.state.aboutprogramme3.toString(),
            aboutProgramme2: parentthis.state.aboutprogramme2.toString()
          }
        })
        .then(dataSnapshot => {
          this.props.handleAdd();
        });
      }
    }
  }

  handleFileUpload = (files) => {
    this.setState({
      files: files,
    });
  };

  //Validations for the Forms in Modals
  validate = () => {
    let progNameError = "";
    let logoFileError = "";
    let universityError = "";
    let academicLevelError = "";
    let modeOfStudyError = "";
    let disciplineError = "";
    let entryQualError = "";
    let subDisciplineError = "";
    let aboutProgError = "";
    let applicationPeriodError = "";
    let intakeMonthsError = "";
    let durationError = "";

    if ( !(this.state.programme && this.state.programme.length >= 4) ) {
      progNameError = "Please enter a valid programme name!";
    } 
    
    if (!this.state.logoFile) {
      logoFileError = "Please upload a logo!";
    }
    else if (this.state.logoFile.includes(".exe")) {
      logoFileError = "File uploaded is executable. Please upload a valid image file!"
    }

    if (!this.state.university) {
      universityError = "Please select a valid university!";
    }

    if (!this.state.academiclevel) {
      academicLevelError = "Please select a valid academic level!";
    }

    if (!this.state.ModeOfStudy) {
      modeOfStudyError = "Please select a valid mode of study!";
    }

    if (this.state.disciplinecheckedItems.length == 0) {
      disciplineError = "Please select at least 1 discipline!";
    }

    if (this.state.entryqualificationcheckedItems.length == 0) {
      entryQualError = "Please select at least 1 entry qualification!";
    }

    if (!this.state.subdisciplinecheckedItems.length == 0) {
      subDisciplineError = "Please select at least 1 sub-discipline!";
    }

    if ( !(this.state.aboutprogramme1 && this.state.aboutprogramme1.length >= 1) ) {
      aboutProgError = "Please enter programme details!";
    }

    if ( !(this.state.aboutprogramme1 && this.state.aboutprogramme2 && this.state.aboutprogramme3) ) {
      aboutProgError = "Please enter programme details!";
    }

    if ( !(this.state.applicationperiod1 && this.state.applicationperiod1.length >= 1) ) {
      applicationPeriodError = "Please enter application period details!";
    }

    if ( !(this.state.applicationperiod1 && this.state.applicationperiod2) ) {
      applicationPeriodError = "Please enter application period details!";
    }

    if ( !(this.state.intakemonthsfulltime && this.state.intakemonthsparttime) ) {
      intakeMonthsError = "Please enter intake month(s) details!";
    }

    if ( !(this.state.durationfulltime && this.state.durationparttime) ) {
      durationError = "Please enter duration details!";
    }

    if (progNameError || logoFileError || universityError || academicLevelError || modeOfStudyError || disciplineError || entryQualError
    || subDisciplineError || aboutProgError || applicationPeriodError || intakeMonthsError || durationError) {
      this.setState({
        progNameError, logoFileError, universityError, academicLevelError, modeOfStudyError, disciplineError, entryQualError, subDisciplineError,
        subDisciplineError, aboutProgError, applicationPeriodError, intakeMonthsError, durationError
      });
      return false;
    } 
    return true;
  }

  //Reset Forms
  resetForm = () => {
    this.setState({
      progNameError: "",
      logoFileError: "",
      universityError: "",
      academicLevelError: "",
      modeOfStudyError: "",
      disciplineError: "",
      entryQualError: "",
      subDisciplineError: "",
      aboutProgError: "",
      applicationPeriodError: "",
      intakeMonthsError: "",
      durationError: "",
      id: "", 
      programme: "", 
      logoFile: "", 
      university: "", 
      academiclevel: "", 
      ModeOfStudy: "", 
      disciplinecheckedItems: [],
      entryqualificationcheckedItems: [],
      subdisciplinecheckedItems: [],
      aboutprogramme1: "",
      aboutprogramme2: "",
      aboutprogramme3: "",
      applicationperiod1: "",
      applicationperiod2: "",
      intakemonthsfulltime: "",
      intakemonthsparttime: "",
      durationfulltime: "",
      durationparttime: ""
    })
  }


  render() {
    return (
      <div>
        <Modal.Header closeButton className="justify-content-center">
          <Modal.Title id="addStudySIMProgModalTitle" className="w-100">
            Add Programme
          </Modal.Title>
        </Modal.Header>

        <Form noValidate>
          <Modal.Body id="addStudySIMProgModalBody">
            {/* Main Row */}
            <Form.Row className="justify-content-center addStudySIMProgFormRow">
              {/* Left Col */}
              <Col md="6" className="addStudySIMProgFormCol text-center">
                {/* Programme Name */}
                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-center">
                    <InputGroup className="addStudySIMProgFormColInputGrp">
                      <FormControl type="text" name="programme" id="addStudySIMProgForm_ProgName" placeholder="Name of Programme*" onChange={this.handleChange}required />
                    </InputGroup>

                    <div className="errorMessage text-left">{this.state.progNameError}</div>
                  </Col>
                </Form.Row>

                {/* Logo File */}
                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left">
                    <InputGroup className="addStudySIMProgFormColInputGrp">
                      <FormControl type="file" name="logoFile" id="addStudySIMProgForm_LogoFile" label="Logo File*" custom required onChange={(e) => {this.handleFileUpload(e.target.files);}} />
                    </InputGroup>

                    <div className="errorMessage text-left">{this.state.logoFileError}</div>
                  </Col>
                </Form.Row>

                {/* University */}
                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-center">
                    <InputGroup className="addStudySIMProgFormColInputGrp">
                      <Form.Control as="select" name="university" defaultValue="" className="addStudySIMProgFormSelect" required noValidate placeholder="Choose a University" onChange={this.handleChange}>
                        <option value="" className="addStudySIMProgFormSelectOption">Choose a University</option>

                        {this.props.universities && this.props.universities.map((University, index) => {
                          return (
                            <option value={University} className="addStudySIMProgFormSelectOption">{University}</option>
                          );
                        })}
                      </Form.Control>
                    </InputGroup>

                    <div className="errorMessage text-left">{this.state.universityError}</div>
                  </Col>
                </Form.Row>

                {/* Academic Level */}
                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-center">
                    <InputGroup className="addStudySIMProgFormColInputGrp">
                      <Form.Control as="select" name="academiclevel" defaultValue="" className="addStudySIMProgFormSelect" required noValidate onChange={this.handleChange}>
                        <option value="" className="addStudySIMProgFormSelectOption">Choose an Academic Level</option>

                        {this.state.AcademicLevel && this.state.AcademicLevel.map((AcademicLevel, index) => {
                          if (AcademicLevel === this.props.academiclevel) {
                            return (
                              <option value={AcademicLevel} className="addStudySIMProgFormSelectOption">{AcademicLevel}</option>
                            );
                          } else {
                            return (
                              <option value={AcademicLevel} className="addStudySIMProgFormSelectOption">{AcademicLevel}</option>
                              );
                            }
                          }
                        )}
                      </Form.Control>
                    </InputGroup>

                    <div className="errorMessage text-left">{this.state.academicLevelError}</div>
                  </Col>
                </Form.Row>

                {/* Mode of Study */}
                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left addStudySIMProgForm_InnerCol">
                    <Form.Label className="addStudySIMProgFormLabel">Choose Mode of Study:</Form.Label>

                    <Container className="addStudySIMProgForm_MoSCon">
                      {/* To be retrieved from db - row is generated dynamically */}
                      <Form.Group>
                        {this.state.Modeofstudy && this.state.Modeofstudy.map((Modeofstudy) => {
                          {
                            if (Modeofstudy == "fullTime") {
                              return (
                                <Row>
                                  <Col>
                                    <Form.Check name="ModeOfStudy" id={Modeofstudy} value={Modeofstudy} type="checkbox" label="Full-Time" className="addStudySIMProgForm_CheckBox" onChange={this.handleChange} />
                                  </Col>
                                </Row>
                              );
                            }

                            if (Modeofstudy == "partTime") {
                              return (
                                <Row>
                                  <Col>
                                    <Form.Check name="ModeOfStudy" id={Modeofstudy} value={Modeofstudy} type="checkbox" label="Part-Time" className="addStudySIMProgForm_CheckBox" onChange={this.handleChange} />
                                  </Col>
                                </Row>
                              );
                            }
                          }
                        })}
                      </Form.Group>
                    </Container>

                    <div className="errorMessage text-left">{this.state.modeOfStudyError}</div>
                  </Col>
                </Form.Row>

                {/* Disciplines */}
                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left addStudySIMProgForm_InnerCol">
                    <Form.Label className="addStudySIMProgFormLabel">Choose Discipline(s):</Form.Label>

                    <Container className="addStudySIMProgForm_DisciplineCon">
                      {/* To be retrieved from db - row is generated dynamically */}
                      <Form.Group>
                        {this.props.disciplines && this.props.disciplines.map((Discipline) => {{
                          return (
                            <Row>
                              <Col>
                                <Form.Check id={Discipline} name="discipline" value={Discipline} type="checkbox" label={Discipline} className="addStudySIMProgForm_CheckBox DisciplineCheckboxes" onChange={this.DisciplinehandleChange} disabled={this.state[Discipline]} />
                              </Col>
                            </Row>
                          );}
                        })}
                      </Form.Group>
                    </Container>

                    <div className="errorMessage text-left">{this.state.disciplineError}</div>
                  </Col>
                </Form.Row>

                {/* Entry Qualifications */}
                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left">
                    <Form.Label className="addStudySIMProgFormLabel">Choose Entry Qualification(s):</Form.Label>

                    <Container className="addStudySIMProgForm_EntryQualCon">
                      {this.state.entryQual && this.state.entryQual.map((entryQual) => {
                        {
                          if (entryQual === "aLevel") {
                            return (
                              <Row>
                                <Col>
                                  <Form.Check name={entryQual} value={entryQual} type="checkbox" label="&#34;A&#34; Level" className="addStudySIMProgForm_CheckBox" onChange={this.handleChange} />
                                </Col>
                              </Row>
                            );
                          }

                          if (entryQual === "degree") {
                            return (
                              <Row>
                                <Col>
                                  <Form.Check name={entryQual} value={entryQual} type="checkbox" label="Degree" className="addStudySIMProgForm_CheckBox" onChange={this.handleChange} />
                                </Col>
                              </Row>
                            );
                          }

                          if (entryQual === "diploma") {
                            return (
                              <Row>
                                <Col>
                                  <Form.Check name={entryQual} value={entryQual} type="checkbox" label="Diploma" className="addStudySIMProgForm_CheckBox" onChange={this.handleChange} />
                                </Col>
                              </Row>
                            );
                          }

                          if (entryQual === "oLevel") {
                            return (
                              <Row>
                                <Col>
                                  <Form.Check name={entryQual} value={entryQual} type="checkbox" label="&#34;O&#34; Level" className="addStudySIMProgForm_CheckBox" onChange={this.handleChange} />
                                </Col>
                              </Row>
                            );
                          }
                        }
                      })}
                    </Container>

                    <div className="errorMessage text-left">{this.state.entryQualError}</div>
                  </Col>
                </Form.Row>
              </Col>

              {/* Right Col */}
              <Col md="6" className="addStudySIMProgFormCol text-center">
                {/* Sub Disciplines */}
                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left addStudySIMProgForm_InnerCol">
                    <Form.Label className="addStudySIMProgFormLabel">Choose Sub-Discipline(s):</Form.Label>

                    <Container className="addStudySIMProgForm_SubDisciplineCon">
                      {this.props.subDisciplines && this.props.subDisciplines.map((subDiscipline, index) => {
                        index = index + 1;
                        return (
                          <Row key={index}>
                            <Col>
                              <Form.Check name={subDiscipline} value={subDiscipline} type="checkbox" label={subDiscipline} className="addStudySIMProgForm_CheckBox subDisciplineCheckboxes" onChange={this.SubDisciplinehandleChange} disabled={this.state["sub" + subDiscipline]} />
                            </Col>
                          </Row>
                        );
                      })}
                    </Container>

                    <div className="errorMessage text-left">{this.state.subDisciplineError}</div>
                  </Col>
                </Form.Row>
              </Col>
            </Form.Row>
          </Modal.Body>

          {/* Programme Details Section */}
          <Modal.Header>
            <Modal.Title id="addStudySIMProgModalTitle" className="w-100">
              Programme Details
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {/* Main Row */}
            <Form.Row className="justify-content-center addStudySIMProgFormRow">
              {/* Left Col */}
              <Col md="6" className="addStudySIMProgFormCol text-center">
                {/* About Programme */}
                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left">
                    <Form.Label className="addStudySIMProgFormLabel">About Programme 1</Form.Label>
                    <FormControl as="textarea" rows="4" required noValidate name="aboutprogramme1" className="addStudySIMProgForm_TextArea" placeholder="About Programme" onChange={this.handleChange} />
                  
                    <div className="errorMessage text-left">{this.state.aboutProgError}</div>
                  </Col>

                  <Col md="9" className="text-left" style={{ paddingTop: "2%" }}>
                    <Form.Label className="addStudySIMProgFormLabel">About Programme 2</Form.Label>
                    <FormControl as="textarea" rows="4" required noValidate name="aboutprogramme2" className="addStudySIMProgForm_TextArea" placeholder="About Programme" onChange={this.handleChange} />
                  </Col>

                  <Col md="9" className="text-left" style={{ paddingTop: "2%" }}>
                    <Form.Label className="addStudySIMProgFormLabel">About Programme 3</Form.Label>
                    <FormControl as="textarea" rows="4" required noValidate name="aboutprogramme3" className="addStudySIMProgForm_TextArea" placeholder="About Programme" onChange={this.handleChange} />
                  </Col>
                </Form.Row>

                {/* Application Period */}
                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left">
                    <Form.Label className="addStudySIMProgFormLabel">Application Period 1</Form.Label>
                    <FormControl as="textarea" rows="2" required noValidate name="applicationperiod1" className="addStudySIMProgForm_TextArea" placeholder="Application Period 1" onChange={this.handleChange} />
                  
                    <div className="errorMessage text-left">{this.state.applicationPeriodError}</div>
                  </Col>

                  <Col md="9" className="text-left" style={{ paddingTop: "2%" }}>
                    <Form.Label className="addStudySIMProgFormLabel">Application Period 2</Form.Label>
                    <FormControl as="textarea" rows="2" required noValidate name="applicationperiod2" className="addStudySIMProgForm_TextArea" placeholder="Application Period 2" onChange={this.handleChange} />
                  </Col>
                </Form.Row>                
              </Col>

              {/* Right Col */}
              <Col md="6" className="addStudySIMProgFormCol text-center">
                {/* Programme Structure */}
                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left">
                    <Form.Label className="addStudySIMProgFormLabel">Programme Structure</Form.Label>

                    <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                      {/* Coursework */}
                      <Col md="6" className="text-left addStudySIMProgForm_InnerCol">
                        <Form.Label className="addStudySIMProgFormLabel">Coursework</Form.Label>

                        <Container className="addStudySIMProgForm_StructureOverseasCon">
                          <Row>
                            <Col style={{ paddingLeft: "10%" }}>
                              <Form.Check name="programmestructurecoursework" value="Coursework" type="checkbox" label="Yes" className="addStudySIMProgForm_CheckBox" onChange={this.handleChange} />
                            </Col>
                          </Row>
                        </Container>
                      </Col>

                      {/* Examination */}
                      <Col md="6" className="text-left addStudySIMProgForm_InnerCol">
                        <Form.Label className="addStudySIMProgFormLabel">Examination</Form.Label>

                        <Container className="addStudySIMProgForm_StructureOverseasCon">
                          <Row>
                            <Col style={{ paddingLeft: "10%" }}>
                              <Form.Check name="programmestructureexamination" value="Examination" type="checkbox" label="Yes" className="addStudySIMProgForm_CheckBox" onChange={this.handleChange} />
                            </Col>
                          </Row>
                        </Container>

                      </Col>
                    </Form.Row>
                  </Col>
                </Form.Row>

                {/* Overseas Opportunity */}
                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left">
                    <Form.Label className="addStudySIMProgFormLabel">Overseas Opportunity</Form.Label>

                    <Form.Row className="justify-content-center">
                      {/* Exchange */}
                      <Col md="6" className="text-left addStudySIMProgForm_InnerCol">
                        <Form.Label className="addStudySIMProgFormLabel">Exchange</Form.Label>

                        <Container className="addStudySIMProgForm_StructureOverseasCon">
                          <Row>
                            <Col style={{ paddingLeft: "10%" }}>
                              <Form.Check name="exchange" value="Exchange" type="checkbox" label="Yes" className="addStudySIMProgForm_CheckBox" onChange={this.handleChange} />
                            </Col>
                          </Row>
                        </Container>
                      </Col>

                      {/* Transfer */}
                      <Col md="6" className="text-left addStudySIMProgForm_InnerCol">
                        <Form.Label className="addStudySIMProgFormLabel">Transfer</Form.Label>

                        <Container className="addStudySIMProgForm_StructureOverseasCon">
                          <Row>
                            <Col style={{ paddingLeft: "10%" }}>
                              <Form.Check name="transfer" value="Transfer" type="checkbox" label="Yes" className="addStudySIMProgForm_CheckBox" onChange={this.handleChange} />
                            </Col>
                          </Row>
                        </Container>
                      </Col>
                    </Form.Row>

                  </Col>
                </Form.Row>

                {/* Intake Month(s) */}
                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left"> 
                    <Form.Label className="addStudySIMProgFormLabel">Intake Month(s)</Form.Label> 

                    <Form.Row className="justify-content-center"> 
                      {/* Full Time */}
                      <Col md="6" className="text-left"> 
                        <Form.Label className="addStudySIMProgFormLabel">Full-Time</Form.Label> 
                        <FormControl as="textarea" rows="3" required noValidate name="intakemonthsfulltime" className="addStudySIMProgForm_TextArea" placeholder="Full-Time" onChange={this.handleChange} /> 
                      </Col> 

                      {/* Part Time */}
                      <Col md="6" className="text-left"> 
                        <Form.Label className="addStudySIMProgFormLabel">Part-Time</Form.Label> 
                        <FormControl as="textarea" rows="3" required noValidate name="intakemonthsparttime" className="addStudySIMProgForm_TextArea" placeholder="Part-Time" onChange={this.handleChange} /> 
                      </Col> 
                    </Form.Row> 

                    <div className="errorMessage text-left">{this.state.intakeMonthsError}</div>
                  </Col> 
                </Form.Row>

                {/* Duration */}
                <Form.Row className="justify-content-center addStudySIMProgForm_InnerRow">
                  <Col md="9" className="text-left">
                    <Form.Label className="addStudySIMProgFormLabel">Duration</Form.Label> 

                    <Form.Row className="justify-content-center"> 
                      {/* Full Time */}
                      <Col md="6" className="text-left"> 
                        <Form.Label className="addStudySIMProgFormLabel">Full-Time</Form.Label> 

                        <FormControl as="textarea" rows="3" required noValidate name="durationfulltime" className="addStudySIMProgForm_TextArea" placeholder="Full-Time" onChange={this.handleChange} /> 
                      </Col> 

                      {/* Part Time */}
                      <Col md="6" className="text-left"> 
                        <Form.Label className="addStudySIMProgFormLabel">Part-Time</Form.Label> 
                        <FormControl as="textarea" rows="3" required noValidate name="durationparttime" className="addStudySIMProgForm_TextArea" placeholder="Part-Time" onChange={this.handleChange} /> 
                      </Col> 
                    </Form.Row> 

                    <div className="errorMessage text-left">{this.state.durationError}</div>
                  </Col>
                </Form.Row>
              </Col>
            </Form.Row>
          </Modal.Body>
        </Form>

        <Modal.Footer className="justify-content-center">
          {/* Add Programme Submit Btn*/}
          <Button type="submit" id="addStudySIMProgFormBtn" onClick={() => {this.addProgramme(); this.resetForm();}}>Submit</Button>
        </Modal.Footer>
      </div>
    );
  }
}
