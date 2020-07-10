/* eslint-disable no-console */
const db = require('./jsonManager')('./data.json');

db.Start()
    .then(async (docs) => {
        const a = db.Find('maquinas', {
            property: 'description',
            toSearch: 'vestibulum',
        });

       db.Filter('users',{})



        db.Save();
    })
    .finally(() => {
        db.Close();
    });
