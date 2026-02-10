import createInitializeWebhandleComponent from "@webhandle/initialize-webhandle-component/create-initialize-webhandle-component.mjs"
import ComponentManager from "@webhandle/initialize-webhandle-component/component-manager.mjs"
import { MongoClient } from 'mongodb'
import filog from 'filter-log'

let initializeWebhandleComponent = createInitializeWebhandleComponent()

initializeWebhandleComponent.componentName = '@webhandle/mongo-db-loader'
initializeWebhandleComponent.componentDir = import.meta.dirname
initializeWebhandleComponent.defaultConfig = {}
initializeWebhandleComponent.staticFilePaths = ['public']
initializeWebhandleComponent.templatePaths = ['views']

let log = initializeWebhandleComponent.log = filog('webhandle', { component: 'mongo-db-loader' })

let counter = 0

initializeWebhandleComponent.setup = async function (webhandle, config) {
	let manager = new ComponentManager()

	let dbDefs = webhandle.config.dbs
	if (!webhandle.dbs) {
		webhandle.dbs = {}
	}
	let dbs = webhandle.dbs

	if (dbDefs && Array.isArray(dbDefs)) {
		for (let current of dbDefs) {
			if (current.type === 'mongodb') {
				let db = {
					dbName: current.dbName,
					collections: []
				}
				let dbName = current.name || current.dbName || 'db' + new Date().getTime() + counter++
				dbs[dbName] = db
				db.name = dbName


				db.client = new MongoClient(current.url)
				try {
					await db.client.connect()
				}
				catch (e) {
					log.error("Could not connect to mongo db:" + current.dbName)
					log.error(err)
					continue
				}
				db.db = db.client.db(db.name)
				if (current.collectionNames) {
					for (let currentCollectionName of current.collectionNames) {
						db.collections[currentCollectionName] = db.db.collection(currentCollectionName)
					}
				}
				if (!webhandle.primaryDatabase) {
					webhandle.primaryDatabase = db
				}

				webhandle.shutdownFunctions.push(async () => {
					log.info("Closing connection to mongo database: " + dbName)
					await db.client.close()
				})

				log.info("Created connection to mongo database connection: " + dbName)
			}
		}
	}

	return manager
}

export default initializeWebhandleComponent
