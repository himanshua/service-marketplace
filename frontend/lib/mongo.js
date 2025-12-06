// filepath: c:\Users\Dell\Documents\ServiceMarketplace\frontend\lib\mongo.js
import { MongoClient } from "mongodb";

let clientPromise;//

async function getClient() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;
  if (!uri || !dbName) {
    throw new Error("Missing MONGODB_URI or MONGODB_DB environment variables");
  }

  if (!clientPromise) {
    const client = new MongoClient(uri);
    clientPromise = client.connect().then((conn) => ({ conn, dbName }));
  }

  return clientPromise;
}

export async function getVisitorsCollection() {
  const { conn, dbName } = await getClient();
  return conn.db(dbName).collection("visitors");
}