const { nanoid } = require("nanoid");
const _ = require("lodash");
const { log } = require("./logs");
const { reject } = require("lodash");
const FindInCollection = async (collectionData, data) => {
	return new Promise(async (resolve, reject) => {
		/* 		const found = collectionData.filter((element) => {
			if (element.hasOwnProperty(property)) {
				if (
					element[property]
						.toString()
						.toLowerCase()
						.includes(data[property].toString().toLowerCase())
				) {
					return element;
				}
			}
		});
		resolve(found); */
	});
};

const CreateCollection = async (database, name, initialState) => {
	return new Promise(async (resolve, reject) => {
		//Add unique id to each table added
		addIdToObjectElements(initialState);
		let state = { _id: nanoid(6), ...initialState };
		if (!database.hasOwnProperty(name)) {
			database[name] = state;
			resolve(database);
		} else {
			console.log("Collection already exist");
			reject();
		}
	});
};

const AddToCollection = async (collectionData, data) => {
	return new Promise(async (resolve, reject) => {
		addIdToObjectElements(data);
		console.log(data);
		if (!_.isArray(collectionData)) {
			Object.keys(data).forEach((keyName) => {
				if (!collectionData.hasOwnProperty(keyName)) {
					collectionData[keyName] = data[keyName];
				} else {
					log.error(`${keyName} Already Exists `);
					reject();
				}
			});
		} else {
			collectionData.push(data);
		}
		resolve(collectionData);
	})
		.then((res) => log.info("Added successfuly"))
		.catch((err) => {
			log.error("Error adding new element");
		});
};

const UpdateInCollection = async (collectionData, index, data) => {
	return new Promise((resolve, reject) => {
		const properties = Object.keys(data);
		properties.map((property) => {
			collectionData[index][property] = data[property];
		});
		resolve(collectionData);
	});
};

const DeleteFromCollection = async (collectionData, identifier) => {
	return new Promise((resolve, reject) => {
		delete collectionData[identifier];
		resolve(collectionData);
	});
};

//Private methods

const addIdToObjectElements = async (objectState) => {
	console.log(Object.keys(objectState));
	Object.keys(objectState).forEach((property) => {
		objectState[property]._id = nanoid(6);
		console.log(objectState)
	});
	console.log(objectState)
};

module.exports = {
	FindInCollection,
	AddToCollection,
	UpdateInCollection,
	DeleteFromCollection,
	CreateCollection,
};
