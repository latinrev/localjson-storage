const fs = require("fs");
const _ = require("lodash");
const {
	FindInCollection,
	AddToCollection,
	DeleteFromCollection,
	UpdateInCollection,
	CreateCollection,
} = require("./operations");
const { log } = require("./logs");
/**
 * Manager for JSON files, it allows to add delete find filter anything in a json file
 * @param {File} fileToParse - Desired file to read
 */

function JsonManager(fileToParse) {
	let database;
	let ignore = false;

	const manipulateDatabase = async (collection, id, cb) => {
		return new Promise(async (resolve, reject) => {
			let index;
			let collectionData = _.get(database, collection);
			if (id !== null) index = _.findIndex(collectionData, { _id: id });
			await cb(collectionData, index);
			_.set(database, collection, collectionData);
			resolve();
		});
	};

	const Save = async () => {
		return new Promise((resolve, reject) => {
			const rstream = fs.createWriteStream(fileToParse);
			rstream.write(JSON.stringify(database, null, 4), "utf-8", (err) => {
				if (err) {
					reject(err);
				} else {
					//log.info("Changes saved succesfully");
					resolve();
				}
			});
		});
	};
	const Do = async ({
		operation,
		collection,
		id,
		data,
		dataMustBeOject,
		doSave,
	}) => {
		return new Promise((resolve, reject) => {
			fs.readFile(
				fileToParse,
				{ encoding: "utf-8" },
				async (err, dbData) => {
					if (err) process.exit();
					database = JSON.parse(dbData);
					if (!_.isObject(data) && dataMustBeOject) {
						reject("Data is not an object");
					}
					await manipulateDatabase(
						collection,
						id ? id : null,
						async (collectionData, index) => {
							switch (operation) {
								case "get":
									resolve(collectionData);
									break;
								case "find":
									const found = await FindInCollection(
										collectionData,
										data
									);
									resolve(found);
									break;
								case "create":
									await CreateCollection(
										database,
										data.name,
										data.initialState
									);
									break;
								case "add":
									await AddToCollection(collectionData, data);
									break;
								case "update":
									await UpdateInCollection(
										collectionData,
										index,
										data
									);
									break;
								case "delete":
									await DeleteFromCollection(
										collectionData,
										index
									);
									break;
								default:
									resolve(collectionData);
									break;
							}
							return collectionData;
						}
					);
					if (doSave) await Save();
					resolve();
				}
			);
		});
	};
	return {
		IgnoreWarnings: () => {
			ignore = true;
		},
		Get: async (collection) => {
			return await Do({ operation: "get", collection });
		},
		Find: async (collection, data) => {
			return await Do({
				operation: "find",
				collection,
				data,
				dataMustBeOject: true,
			});
		},
		Create: async (name, initialState) => {
			await Do({
				operation: "create",
				data: { name, initialState },
				dataMustBeOject: true,
				doSave: true,
			});
		},
		Add: async (collection, data) => {
			await Do({
				operation: "add",
				collection,
				data,
				dataMustBeOject: true,
				doSave: true,
			});
		},
		Update: async (collection, identifier, data) => {
			await Do({
				operation: "update",
				collection,
				identifier,
				data,
				dataMustBeOject: true,
				doSave: true,
			});
		},
		Delete: async (collection, id) => {
			await Do({ operation: "delete", collection, id, doSave: true });
		},
	};
}

module.exports = JsonManager;
