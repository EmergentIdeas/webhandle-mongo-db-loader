import setup from "../initialize-webhandle-component.mjs"
import test from "node:test"
import assert from "node:assert"

import { ObjectId } from "mongodb"

export default async function start(webhandle) {
	await setup(webhandle)

	let wh = webhandle

	await test("basic tests for functionality", async function (t) {
		await t.test("simple creation", function () {
			assert(wh.dbs != null)
			assert(wh.dbs['test-2'] != null)
			assert(wh.dbs['test-2'].collections.length != null)

		})

		await t.test("write data", async function () {

			let first1 = wh.dbs['test1'].collections.first
			let first2 = wh.dbs['test-2'].collections.first

			await first1.deleteMany({})
			await first1.insertOne({ when: new Date(), msg: 'hello' })
			let objs = await first1.find({msg: 'hello'}).toArray()
			let found = objs[0]
			assert.equal(found.msg, 'hello', "Message should say hello.")

			// console.log(found._id.toString())
			let idString = found._id.toString()
			let idObj = new ObjectId(idString)
			
			objs = await first1.find({_id: idObj}).toArray()
			found = objs[0]

			console.log(found)




		})


	})

	webhandle.shutdown()

}