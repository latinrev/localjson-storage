 /* CreateDatabase: async (name, fields) => {
  return new Promise(async (resolve, reject) => {
    let check = await checkForMissingArguments("CreateDatabase", {
      name,
      fields,
    });
    if (!check) {
      let filename = name + ".json";
      if (fileToParse === undefined) {
        if (!fs.existsSync(filename)) {
          fileToParse = filename;
          fs.writeFileSync(filename, JSON.stringify(fields, null, 4));
          resolve();
        } else {
          fileToParse = filename;
          log.warning(
            `Database "${name}" already exist, please pass it as an argument to your instance of the class`
          );
        }
      }
    } else {
      reject();
    }
  });
}, */
    /* CreateCollection: async (collection, name, initialState) => {
      return new Promise(async (resolve, reject) => {
        let check = await ValidOperationCheck("CreateTable", {
          collection,
          name,
          initialState,
        });
        if (check) {
          manipulateDatabase(collection, null, (collectionData) => {
            if (!collectionData.hasOwnProperty(name)) {
              collectionData[name] = initialState;
              collectionData[name]._id = nanoid(6);
              return collectionData;
            } else {
              log.warning("Table already exist");
            }
          }).then(() => resolve());
        } else {
          reject();
        }
      });
    },
    DeleteCollection: async (collection, id) => {
      return new Promise(async (resolve, reject) => {
        let check = await ValidOperationCheck("DeleteTable", {
          collection,
          id,
        });
        if (check) {
          manipulateDatabase(collection, id, (collectionData) => {
            Object.keys(collectionData).forEach((curr) =>
              collectionData[curr]._id === id ? delete collectionData[curr] : null
            );
            return collectionData;
          }).then(() => resolve());
        } else {
          reject();
        }
      });
    }, */