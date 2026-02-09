# @webhandle/mongo-db-loader

Creates connections to mongodb databases. It operates on elements of the configuration like:

```json
{
	"dbs": [
		{
			"type": "mongodb",
			"dbName": "test1",
			"url": "mongodb://localhost:27017/",
			"collectionNames": [
				"first",
				"second",
				"third"
			]
		},
		{
			"type": "mongodb",
			"dbName": "test2",
			"url": "mongodb://localhost:27017/",
			"collectionNames": [
				"staff",
				"slides"
			],
			"name": "test-2"
		}
	]
}
```

Loaded databases are available at `webhandle.dbs` where each is keyed by database name.
The first database is stored at `webhandle.primaryDatabase`.


The loaded database information has the format:


```js
{
  dbName: 'test2',
  collections: [
    staff: mongoCollectionContainingStaff
    slides: mongoCollectionContainingSlides
  ],
  name: 'test-2',
  client: theMongoClientObject,
  db: aMongoDBObject

}

```