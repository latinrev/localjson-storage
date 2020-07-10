/* eslint-disable no-console */
// ! EMPTY ARGUMENT ERROR HANDLING
const db = require("./jsonManager")("./data.json");
// ! EMPTY ARGUMENT ERROR HANDLING

db.Start()
  .then(async (docs) => {
    const a = db.Find("maquinas", {
      property: "description",
      toSearch: "vestibulum",
    });

    let b = db.Filter("users", { property: "name", filterString: "Joel" });
    console.log(b);

    db.Save();
  })
  .finally(() => {
    db.Close();
  });
