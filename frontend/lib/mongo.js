// filepath: c:\Users\Dell\Documents\ServiceMarketplace\frontend\lib\mongo.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri || !dbName) throw new Error("Missing Mongo env vars");

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getVisitorsCollection() {
  const conn = await clientPromise;
  return conn.db(dbName).collection("visitors");
}