import _ from "lodash";
import fetch from "node-fetch";

const ROOT_URL = "https://august-schools.herokuapp.com";

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
