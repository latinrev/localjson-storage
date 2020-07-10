/* eslint-disable no-unused-expressions */
/* eslint-disable no-plusplus */
/* eslint-disable no-prototype-builtins */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
const fs = require('fs');
const qr = require('qrcode');
const { nanoid } = require('nanoid');
const pino = require('pino');

const log = pino({ prettyPrint: { colorize: true } });
const dbs = { open: true, close: false };

const throwDatabaseNotOpen = () => log.error('Database is not open');
const missingArgument = (method, argumentsArray) => argumentsArray.forEach(({ arg, property }) => (arg === undefined ? log.error(`On method ${method} ${property} is not defined`) : ''));
/**
 * Manager for JSON files, it allows to add delete find filter anything in a json file
 * @param {File} fileToParse - Desired file to read
 */

const JsonManager = (fileToParse) => {
    let db;
    let dbstatus;
    let operation;
    let errors = 0;
    const struct = {};

    const generateQR = (id) => qr.toDataURL(id);

    const searchIndex = (table, property, filter) => operation[table].findIndex((curr) => curr[property].toString().toLowerCase().includes(filter.toLowerCase()));

    return {
    /**
     * Structure of items inside dataabse this is not necessary but is highly
     * recommended to have the structure of items displayed on auto-complete
     * @param {Object} struct - Desired database structure
     */
        ItemStruct: (struct) => {
            if (struct !== undefined) {
                this.struct = struct;
            } else {
                errors++;
                missingArgument('ItemStruct', [{ arg: struct, property: 'struct' }]);
            }
        },
        Start: () => new Promise((resolve, reject) => {
            if (!dbstatus) {
                fs.readFile(fileToParse, { encoding: 'utf8' }, (err, data) => {
                    if (!err) {
                        dbstatus = dbs.open;
                        db = JSON.parse(data);
                        operation = JSON.parse(data);
                        resolve(operation);
                    } else {
                        errors++;
                        reject(err);
                    }
                });
            } else {
                console.error('Database is already open');
            }
        }),
        Close: () => {
            if (dbstatus) {
                dbstatus = dbs.close;
                db = '';
                operation = '';
            } else {
                errors++;
                throwDatabaseNotOpen();
            }
        },
        Save: () => new Promise((resolve, reject) => {
            if (dbstatus) {
                if (errors === 0) {
                    const rstream = fs.createWriteStream(fileToParse);
                    rstream.write(
                        JSON.stringify(operation, null, 4),
                        'utf-8',
                        (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                console.log('File saved succesfully');
                                resolve();
                            }
                        },
                    );
                } else {
                    log.error(
                        "Errors! Can't save changes. Please check logs to see the details.",
                    );
                }
            } else {
                errors++;
                reject('Database is not open');
            }
        }), /*
        Undo: () => new Promise((resolve, reject) => {
            if (dbstatus) {
                fs.writeFile(fileToParse, JSON.stringify(db), (err) => {
                    if (err) {
                        reject(err);
                        errors++;
                    } else {
                        console.log('Changes undone succesfully');
                        resolve();
                    }
                });
            } else {
                errors++;
                reject('Database is not open');
            }
        }), */
        /**
        *  Returns entire database
        */
        Docs: () => {
            if (dbstatus) {
                return operation;
            }
            errors++;
            throwDatabaseNotOpen();
        },
        CreateTable: (name) => {
            if (name !== undefined) {
                if (dbstatus) {
                    if (
                        !operation.hasOwnProperty(name)
            && name !== 'name'
            && name !== 'id'
                    ) {
                        operation[name] = [];
                        console.log(`Created table : ${name}`);
                    } else {
                        console.error('Table already exist');
                    }
                } else {
                    errors++;
                    throwDatabaseNotOpen();
                }
            } else {
                errors++;
                missingArgument('CreateTable', [{ arg: name, property: 'name' }]);
            }
        },
        DeleteTable: (name) => {
            if (name !== undefined) {
                if (dbstatus) {
                    delete operation[name];
                } else {
                    errors++;
                    throwDatabaseNotOpen();
                }
            } else {
                errors++;
                missingArgument('DeleteTable', [{ arg: name, property: 'name' }]);
            }
        },
        /**
     * Allows to add items to the database
     * @param {struct} item - Adds item to specified database
     * @param {Array} place - Desired array to search
     */
        Add: async (table, item) => {
            if (table !== undefined && item !== undefined) {
                if (dbstatus) {
                    item.id = nanoid(6);
                    item.qr = await generateQR(item.id);
                    if (operation[table] !== undefined) {
                        operation[table].push(item);
                    } else {
                        errors++;
                        log.error(`Table '${table}' doesn't exist...`);
                        log.info('Try creating the table then adding data to it');
                    }
                    return item.id;
                }
                throwDatabaseNotOpen();
            } else {
                errors++;
                missingArgument('Add', [
                    { arg: table, property: 'table' },
                    { arg: item, property: 'item' },
                ]);
            }
        },
        /**
     * Allows to delete items from the database
     * @param {String} id - Index of element to delete
     * @param {Array} place - Desired array to search
     */
        Delete: (table, { property, filter }) => {
            if (
                table !== undefined
        && property !== undefined
        && filter !== undefined
            ) {
                if (dbstatus) {
                    const index = searchIndex(table, property, filter);
                    if (index !== -1) operation[table].splice(index, 1);
                } else {
                    errors++;
                    throwDatabaseNotOpen();
                }
            } else {
                errors++;
                missingArgument('Delete', [
                    { arg: table, property: 'table' },
                    { arg: property, property: 'property' },
                    { arg: filter, property: 'filter' },
                ]);
            }
        },
        /**
     * @param {String} index - Index of element to find
     * @param {Array} place - Desired array to search
     */
        Find: (table, { property, filter }) => {
            if (
                table !== undefined
        && property !== undefined
        && filter !== undefined
            ) {
                if (dbstatus) {
                    const index = searchIndex(table, property, filter);
                    const element = operation[table][index];
                    return element || `Couldn't find ${property} : ${filter}`;
                }
                errors++;
                throwDatabaseNotOpen();
            } else {
                errors++;
                missingArgument('Find', [
                    { arg: table, property: 'table' },
                    { arg: property, property: 'property' },
                    { arg: filter, property: 'filter' },
                ]);
            }
        },
        /**
     * @param {String} filterString - Desired filter to search in array
     * @param {Array} place - Desired array to search
     */
        Filter: (table, { property, filter }) => {
            if (
                table !== undefined
                && property !== undefined
                && filter !== undefined
            ) {
                if (dbstatus) {
                    console.log('??');
                    let docs = [];
                    console.log(docs.length);
                    docs = operation[table].filter((curr) => curr[property].toLowerCase().includes(filter.toLowerCase()));
                    return docs.length > 0
                        ? docs
                        : `No documents found on table ${table} ${property} : ${filter}`;
                }
                errors++;
                throwDatabaseNotOpen();
            } else {
                errors++;
                missingArgument('Filter', [
                    { arg: table, property: 'table' },
                    { arg: property, property: 'property' },
                    { arg: filter, property: 'filter' },
                ]);
            }
        },
    };
};

module.exports = JsonManager;
