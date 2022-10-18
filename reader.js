// Initate a eventlistener
const dataInput = document.querySelector("#read");
dataInput.addEventListener("input", (eve) => {
  try{
    CodingTabulation(dataInput.value);
  }catch{
    console.log("Oops Wrong Input");
  }
})
// document.querySelector("#fileSel").addEventListener("change",(ev)=>{
//   console.log(ev.path[0].files[0]);
// })
// Decode CIFP into a tabular data
function CodingTabulation(rawdata) {
  // CIFP data
  let cifpData = rawdata;
  // split the data with "\n"
  cifpData = cifpData.split("\n");
  // remove a empty line form the array and replace empty space with char
  cifpData = cifpData.filter((line) => {
    return line !== ""
  });
  let procedures = cifpData.map((proc) => {
    return proc.replace(/ /g, "x")
  });
  // Create array with ranges to split.
  const approachRange = [
    [6, 10],
    [10, 12],
    [12, 13],
    [13, 19],
    [19, 20],
    [20, 25]
  ];
  const sidstarRange = [
    [6, 10],
    [10, 12],
    [12, 13],
    [20, 25],
    [19, 20],
    [13, 19]
  ];
  const commonRange = [
    [26, 29],
    [29, 34],
    [40, 41],
    [42, 43],
    [41, 42],
    [43, 44],
    [44, 48],
    [47, 49],
    [50, 53],
    [54, 56],
    [57, 61],
    [62, 66],
    [66, 70],
    [70, 74],
    [74, 79],
    [82, 83],
    [84, 94],
    [99, 102],
    [94, 99],
    [106, 111],
    [128, 132],
    [102,106],
  ]
  const titleRange = ["icao", "CountryCode", "procstage", "rwy", "proceduretype", "transitionid", "legnumber", "waypoint", "flyover", "fixattr","comp", "turndirections", "rnp", "legtype", "recomnavaid", "recomcountrycode", "radius", "theta", "rho", "crsmag", "distance", "altdesc", "altitude", "speed", "ta", "center", "cycle","gradient"];
  let decodeRange = [];
  let decoded = [];
  let table = document.getElementById("coding");
  let decodeLine = document.querySelectorAll(".decodeLine");
  let clearData = [".decodeLine",".title"];
  // Loop through and split string with assigned range
  procedures.forEach((procedure, index) => {

    let procedureLeg = {};
    let typeOfProc = procedure.substring(12, 13);
    // console.log(typeOfProc);
    if (typeOfProc == "F") {
      decodeRange = [...approachRange, ...commonRange]
    } else if (typeOfProc == "D" || typeOfProc == "E") {
      decodeRange = [...sidstarRange, ...commonRange]
    }
    decodeRange.forEach((split, ind) => { // sip+ ": " +
      // lineVal = lineVal + "," + splitCat[ind] + ": " + procedure.substring(split[0], split[1]);
      procedureLeg[titleRange[ind]] = procedure.substring(split[0], split[1]);
    })
    // Push all the split string into an array
    decoded.push(procedureLeg);
  })

  // Create tr, td and add the data into the table.
  // Remove all available data or Table row other than header
  // decodeLine.forEach((row) => {
  //   row.remove();
  // });
  clearData.forEach((clearentity)=>{
    clearOldTblData(clearentity);
  })

  let procedureTitlePr = "";
  let procedureTitleNx = "";
  decoded.forEach((instance, index) => {
    // console.log("Previous:" + procedureTitleNx);
    // let procedureTitle = "";
    // Destruct the object
    let {
      icao,
      CountryCode,
      procstage,
      rwy,
      proceduretype,
      transitionid,
      legnumber,
      waypoint,
      flyover,
      fixattr,
      comp,
      turndirections,
      rnp,
      legtype,
      recomnavaid,
      recomcountrycode,
      radius,
      theta,
      rho,
      crsmag,
      distance,
      altdesc,
      altitude,
      speed,
      ta,
      center,
      cycle,
      gradient
    } = instance;
    // console.log(cycle);

    let procCategory = "";
    let proceCode = "";
    // Proc ICAO, Type, and RWY.
    if (procstage == "F") {
      procCategory = "APCH";
      proceCode =  icao + "/ " + rwy;//cycle + ": " +
      procedureTitlePr =  (proceCode + " / " + procCategory).replace(/x/g, "");
    } else if (procstage == "D") {
      procCategory = "DEP";
      proceCode = rwy + " : " + icao + "/ " + transitionid;
      procedureTitlePr = (proceCode + " / " + procCategory).replace(/x/g, "");
    } else if (procstage == "E") {
      procCategory = "ARR";
      proceCode = rwy + " : " + icao + "/ " + transitionid;
      procedureTitlePr = (proceCode + " / " + procCategory).replace(/x/g, "");

    }
    // Adding header
    if (procedureTitlePr !== procedureTitleNx) {
      // debugger
      // Additional Row
      let original = document.createElement("tr");
      original.className = "title"
      let originalRow = document.createElement("td");

      originalRow.setAttribute("colspan", "20");
      originalRow.innerHTML = cycle +" : "+ procedureTitlePr.replace(/x/g, "");
      original.appendChild(originalRow);
      table.appendChild(original);
    }
    procedureTitleNx = procedureTitlePr;
    // Array the table data tableFiller
    let tableFiller = [legnumber,transitionid, flyover, legtype, rnp, fixattr,comp, waypoint, altdesc, altitude, speed, crsmag, turndirections, distance, radius, center, recomnavaid, theta, rho,gradient]; //, proceCode, procCategory
    // Create Table row and fill dataInput
    let row = document.createElement("tr");
    row.className = "decodeLine"

    tableFiller.forEach((item) => {
      let cell = document.createElement("td");
      cell.innerHTML = item.replace(/x/g, "");
      row.appendChild(cell);
    })
    table.appendChild(row);
  })
}

const clearOldTblData = (ent)=>{
  let tobeRemoved = document.querySelectorAll(ent);
  tobeRemoved.forEach((single)=>{
    single.remove();
  })
}
