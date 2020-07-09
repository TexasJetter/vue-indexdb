import * as _utility from "@/utility";

const dbName = "Vue.IndexDB";
const dbVersion = 2;
const verbose = true;

export function getCustomers() {
	if (verbose === true) console.log("getCustomers: making promise");
	return new Promise((resolve, reject) => {
		_getDb()
			.then((responseDb) => {
				let responseCustomers = {
					Success: false,
					Message: "Unable to get Customers from IndexDb",
					Customers: [],
				};
				let db = responseDb.Db;
				let trans = db.transaction(["Customers"], "readonly");
				trans.onerror = (e) => {
					if (verbose === true) console.log("getCustomers: promise rejected - transaction");
					return reject(responseCustomers);
				};
				let store = trans.objectStore("Customers");
				store.onerror = (e) => {
					if (verbose === true) console.log("getCustomers: promise rejected - store");
					return reject(responseCustomers);
				};
				let query = store.index("ByLastName").getAll();
				query.onsuccess = (e) => {
					if (verbose === true) console.log("getCustomers: promise resolved");
					responseCustomers.Success = true;
					responseCustomers.Message = "";
					responseCustomers.Customers = e.target.result;
					return resolve(responseCustomers);
				};
				query.onerror = (e) => {
					if (verbose === true) console.log("getCustomers: promise rejected - request");
					return reject(responseCustomers);
				};
			})
			.catch((error) => {
				if (verbose === true) console.log("getCustomers: catch triggered");
				return reject({
					Success: false,
					Message: error.Message,
					Customers: [],
				});
			});
	});
}

export function getCustomer(customerId) {
	if (verbose === true) console.log("getCustomer (" + customerId + "): making promise");
	return new Promise((resolve, reject) => {
		_getDb()
			.then((responseDb) => {
				let responseCustomer = {
					Success: false,
					Message: "Unable to get Customer for Id:" + customerId,
					Customer: null,
				};
				let db = responseDb.Db;
				let trans = db.transaction(["Customers"], "readonly");
				trans.onerror = (e) => {
					if (verbose === true) console.log("getCustomer: promise rejected - transaction");
					return reject(responseCustomer);
				};
				let store = trans.objectStore("Customers");
				store.onerror = (e) => {
					if (verbose === true) console.log("getCustomer: promise rejected - store");
					return reject(responseCustomer);
				};
				let query = store.get(customerId);
				query.onsuccess = (e) => {
					if (verbose === true) console.log("getCustomer: promise resolved");
					if (e.target.result == null) {
						responseCustomer.Success = false;
						responseCustomer.Message = "Requested Customer not found";
						return resolve(responseCustomer);
					}
					responseCustomer.Success = true;
					responseCustomer.Message = "";
					responseCustomer.Customer = e.target.result;
					return resolve(responseCustomer);
				};
				query.onerror = (e) => {
					if (verbose === true) console.log("getCustomer: promise rejected - query");
					return reject(responseCustomer);
				};
			})
			.catch((error) => {
				if (verbose === true) console.log("getCustomer: catch triggered");
				return reject({
					Success: false,
					Message: error.Message,
					Customer: null,
				});
			});
	});
}

export function saveCustomer(customer) {
	if (verbose === true) console.log("saveCustomer: making promise");
	return new Promise((resolve, reject) => {
		_getDb()
			.then((responseDb) => {
				let responseCustomer = {
					Success: false,
					Message: "Unable to save Customer",
					CustomerId: null,
				};
				let db = responseDb.Db;
				let trans = db.transaction(["Customers"], "readwrite");
				trans.onerror = (e) => {
					if (verbose === true) console.log("saveCustomer: promise rejected - transaction");
					return reject(responseCustomer);
				};
				let store = trans.objectStore("Customers");
				store.onerror = (e) => {
					if (verbose === true) console.log("saveCustomer: promise rejected - store");
					return reject(responseCustomer);
				};
				if (customer.Id == null || customer.Id === _utility.emptyGuid) {
					customer.Id = _utility.newGuid();
				}
				let query = store.put(customer);
				query.onsuccess = (e) => {
					if (verbose === true) console.log("saveCustomer: promise resolved");
					responseCustomer.Success = true;
					responseCustomer.Message = "";
					responseCustomer.CustomerId = customer.Id;
					return resolve(responseCustomer);
				};
				query.onerror = (e) => {
					if (verbose === true) console.log("saveCustomer: promise rejected - query");
					return reject(responseCustomer);
				};
			})
			.catch((error) => {
				if (verbose === true) console.log("saveCustomer: catch triggered");
				return reject({
					Success: false,
					Message: error.Message,
					CustomerId: null,
				});
			});
	});
}

export function deleteCustomer(customerId) {
	if (verbose === true) console.log("deleteCustomer: making promise");
	return new Promise((resolve, reject) => {
		_getDb()
			.then((responseDb) => {
				let responseCustomer = {
					Success: false,
					Message: "Unable to delete Customer",
				};
				let db = responseDb.Db;
				let trans = db.transaction(["Customers"], "readwrite");
				trans.onerror = (e) => {
					if (verbose === true) console.log("deleteCustomer: promise rejected - transaction");
					return reject(responseCustomer);
				};
				let store = trans.objectStore("Customers");
				store.onerror = (e) => {
					if (verbose === true) console.log("deleteCustomer: promise rejected - store");
					return reject(responseCustomer);
				};

				let query = store.delete(customerId);
				query.onsuccess = (e) => {
					if (verbose === true) console.log("deleteCustomer: promise resolved");
					responseCustomer.Success = true;
					responseCustomer.Message = "";
					return resolve(responseCustomer);
				};
				query.onerror = (e) => {
					if (verbose === true) console.log("deleteCustomer: promise rejected - query");
					return reject(responseCustomer);
				};
			})
			.catch((error) => {
				if (verbose === true) console.log("deleteCustomer: catch triggered");
				return reject({
					Success: false,
					Message: error.Message,
				});
			});
	});
}

//Private functions
//---------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------
function _getDb() {
	return new Promise((resolve, reject) => {
		let response = {
			Success: false,
			Message: "There was a problem getting the IndexDb",
			Db: null,
		};
		var request = window.indexedDB.open(dbName, dbVersion);
		request.onupgradeneeded = (e) => {
			let db = e.target.result;
			if (e.oldVersion >= 1) {
				db.createObjectStore("Customers", { keyPath: "Id" });
			}
			if (e.newVersion >= 2) {
				//If you are changing the schema of existing tables you have to first delete it
				if (db.objectStoreNames.contains("Customers")) db.deleteObjectStore("Customers");
				let customers = db.createObjectStore("Customers", { keyPath: "Id" });
				customers.createIndex("ByLastName", "LastName");
			}
			//-----------------------------------------------------------------------------------
			//-----------------------------------------------------------------------------------
			// Note: If you add new tables make sure to include them in the clearAllData function
			//-----------------------------------------------------------------------------------
			//-----------------------------------------------------------------------------------
		};
		request.onsuccess = (e) => {
			if (verbose === true) console.log("Success getting IndexDB");
			response.Success = true;
			response.Message = "";
			response.Db = e.target.result;
			return resolve(response);
		};

		request.onerror = (e) => {
			if (verbose === true) console.log("Error getting IndexDB: ", e);
			return reject(response);
		};
	});
}
