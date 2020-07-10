/* eslint-disable no-console */
// ! EMPTY ARGUMENT ERROR HANDLING
const db = require('./jsonManager')('./data.json');
// ! EMPTY ARGUMENT ERROR HANDLING

db.Start()
    .then(async (docs) => {
        const a = db.Find('maquinas', {
            property: 'description',
            filter: 'vestibulum',
        });

        const b = db.Filter('users', { property: 'name', filterString: 'Joel' });
        console.log(b);
        await db.Add('asdas',{asdas:"asdas"})
        db.Save(); 
    })
    .finally(() => {
        db.Close();
    });
