/////////////
// Integration: Oh No-VID!
/////////////
//
// The front office has just sent word of a COVID exposure on campus!
// Little Joseph Smith started feeling ill this morning and has since
// tested positive for the virus. We need to immediately prepare a list
// of students to dismiss to prevent further contagion. It's up to you,
// dear programmer, to save the day!
//
// For our purposes, we consider all the siblings of Joseph Smith as
// likely to be infected as well. We need to find the names of all students
// that share any class (called a "group" by the SIS) with any of the
// Smith children. Write a script that calculates and prints these names.
//
/////////////
//
// Unfortunately, our SIS backend is pretty primitive and supports only
// a few API methods:
//
// ROOT = https://august-interview.herokuapp.com/
//
// GET /students.json?first_name=<String>&last_name=<String>
// Returns an array of students with a given first name and last name.
// Note that there is only one student named Joseph Smith.
//
// GET /students.json?id=<String>
// Returns an array of students with a given id. Ids are unique.
//
// GET /groups.json?student=<String>
// Returns an array of groups (ie "classes") enrolled by the student with a given id.
//
// A student has the following shape:
// {
//   'id' => {
//     '$oid' => '60ac2e5ef6f40719fae44a0c'
//   },
//   'first_name' => 'Joseph',
//   'last_name' => 'Smith',
//   'sibling_ids' => [
//     { '$oid' => '60ac2e5ef6f40719fae44a0d' },
//     { '$oid' => '60ac2e5ef6f40719fae44a0e' }
//   ],
// }
//
// A group (or class) looks like this:
// {
//   "_id": {
//     "$oid": '60ac32ff71c27e0004f6e964'
//   },
//   "name": 'Year 2008 - Group 0',
//   "student_ids": [
//     { "$oid": '60ac32f071c27e0004f6e8ae' },
//     { "$oid": '60ac32f071c27e0004f6e8b5' },
//     { "$oid": '60ac32f071c27e0004f6e8b9' },
//     { "$oid": '60ac32f071c27e0004f6e8ba' },
//   ],
//   "updated_at": '2021-05-24T23:13:03.503Z'
// }
/////////////

import _ from "lodash";
import fetch from "node-fetch";

const ROOT_URL = "https://august-interview.herokuapp.com";

const fetchStudents = (params) => {
  const pms = new URLSearchParams();
  _.forEach(params, (v, k) => {
    pms.set(k, v);
  });
  return fetch(`${ROOT_URL}/students.json?${pms.toString()}`);
};

const fetchClasses = (id) => {
  return fetch(`${ROOT_URL}/groups.json?student=${id}`);
};

const patientZero = (
  await (
    await fetchStudents({ first_name: "Joseph", last_name: "Smith" })
  ).json()
)[0];
console.log("Patient zero", patientZero);

const affectedPopulation = patientZero.sibling_ids.concat(patientZero.id);
console.log("Initial population", affectedPopulation);

affectedPopulation.push(
  ...(await Promise.all(
    affectedPopulation.map(({ $oid: id }) => fetchClasses(id))
  )
    .then((results) => {
      return Promise.all(results.map((result) => result.json()));
    })
    .then((classes) => {
      return _.flatten(classes).flatMap((cls) => cls.student_ids);
    }))
);
console.log("All affected population", affectedPopulation);

const studentNames = await Promise.all(
  _.uniqBy(affectedPopulation, "$oid").map(({ $oid: id }) =>
    fetchStudents({ id })
  )
)
  .then((results) => {
    return Promise.all(results.map((result) => result.json()));
  })
  .then((students) =>
    _.flatten(students).map(
      ({ first_name, last_name }) => `${first_name} ${last_name}`
    )
  );

console.log("Affected students", studentNames);
console.log("Total count", studentNames.length);
