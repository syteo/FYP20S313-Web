import React, { Component, useReducer } from "react";
import fire from "../../../config/firebase";
import history from "../../../config/history";
import firecreate from "../../../config/firebasecreate";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


class GenerateAttendance extends Component {
  constructor() {
    super();
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      programmeName: "",
      universityName: "",
      id: "",
      totalNumber: 0,
      date: "",
      useremail:"",
      uniId:"",
    };
  }

  authListener() {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        const db = fire.firestore();

        var getrole = db
          .collection("Administrators")
          .where("email", "==", user.email);
          this.state.useremail=user.email;
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


  componentDidMount=() =>{ 
    this.authListener()
}

display() {
  const db = fire.firestore();
  var counter = 1;
  //Retrieve Attendance
  const userRef = db
    .collection("Attendance")
    .get()
    .then((snapshot) => {
      const attendance = [];
      snapshot.forEach((doc) => {
        const data = {
          firstName: doc.data().firstName,
          lastName: doc.data().lastName,
          email: doc.data().email,
          date: doc.data().date,
          programmeName: doc.data().programmeName,
          universityName: doc.data().universityName,
          id: doc.id,
          counter : counter,
        };
        counter++;
        attendance.push(data);
        console.log(data)
      });

      this.setState({ attendance: attendance });
    });

    // Get All Universities
    db.collection("Universities").get()
    .then((snapshot) => {
      const university = [];
      snapshot.forEach((doc) => {
        const data = {
          docid: doc.id,
          uniId: doc.data().id,
          universityName: doc.data().universityName,
        };
        university.push(data);
      });
      this.setState({ university: university });
    });
}



  generateReport = () => {
    const db = fire.firestore();
    var counter = 0;
    const total = db
      .collection("Attendance")
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
            console.log(doc.id);
          counter++;
        });
        this.setState(
            {
                totalNumber: counter
            },
            () => {
              console.log(this.state.totalNumber);
              this.generatePDF();
            }
          );
        });
      console.log(counter);

    }
generatePDF(){
    var doc = new jsPDF("landscape");
    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
      ];

    var today = new Date();    
    var day = today.getDate();
    var monthIndex = today.getMonth();
    var year = today.getFullYear();
    var date = day + ' ' + monthNames[monthIndex] + ' ' + year;
    var newdat = "\nDate Requested : "+ date;
    doc.setFontSize(14);   
    doc.text(206,20,newdat);

    var user = this.state.useremail;
    var adminuser = "\nRequested by : " + user;
    doc.setFontSize(14);   
    doc.text(14,20,adminuser);

    doc.line(14, 30, 283, 30);
        

    var totalNumber = "\nTotal Number : " + this.state.totalNumber;
    doc.setFontSize(20);   
    doc.text(215,34,totalNumber);

    doc.line(14, 50, 283, 50);

    doc.setFontSize(12);
    doc.text(14,57,"List of People Registered");

    doc.autoTable({
      html: "#attendance",
      startY: 63,
      didParseCell: function (data) {
        var rows = data.table.body;
        if (data.row.index === 0) {
          data.cell.styles.fontStyle = "bold";
        }
      },
    });

    doc.setFontSize(18); 
    doc.text("Report on Total Number of Attendees for Programme Talks", 65, 15);
      
    doc.save("StudentAttendance.pdf");
  };


  render() {
    return (
      <div className="home">
        <div>
            {/* Do not change the id below*/}
          <table id="attendance" class="table table-bordered">
            <tbody>
              <tr>
                <th scope="col">S/N</th>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Email</th>
                <th scope="col">Date</th>
                <th scope="col">Name of University</th>
                <th scope="col">Programme Name</th>
              </tr>
              {this.state.attendance &&
                this.state.attendance.map((attendance) => {
                  return (
                    <tr>
                      <td>{attendance.counter}</td>
                      <td>{attendance.firstName} </td>
                      <td>{attendance.lastName} </td>
                      <td>{attendance.email} </td>
                      <td>{attendance.date} </td>
                      <td>{attendance.universityName} </td>
                      <td>{attendance.programmeName} </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <button onClick={this.generateReport}>Generate PDF</button>
      </div>
    );
  }
}
export default GenerateAttendance;
