/* eslint-disable no-console */
const db = require('./jsonManager')('./data.json');

db.Start()
    .then(async (docs) => {


        const b = db.Filter('piezas', { property: 'name',filter:'mm'});
        console.log(b);
        db.Save();
    })
    .finally(() => {
        db.Close();
    });
