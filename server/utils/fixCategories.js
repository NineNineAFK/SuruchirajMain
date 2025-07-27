// Script to remove 'Intl. ' prefix from category names in all products
// Usage: node server/utils/fixCategories.js

const { MongoClient } = require('mongodb');

// Hardcoded connection details
const uri = 'mongodb+srv://Aaditya:admin@cluster0.kxn151h.mongodb.net/d9';
const dbName = 'd9';
const collectionName = 'products';

async function fixCategories() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const products = db.collection(collectionName);

    const result = await products.updateMany(
      { category: { $elemMatch: { $regex: /^Intl\. / } } },
      [
        {
          $set: {
            category: {
              $map: {
                input: "$category",
                as: "cat",
                in: {
                  $cond: [
                    { $regexMatch: { input: "$$cat", regex: /^Intl\. / } },
                    { $substrBytes: ["$$cat", 6, { $strLenBytes: "$$cat" }] },
                    "$$cat"
                  ]
                }
              }
            }
          }
        }
      ]
    );

    console.log('Matched:', result.matchedCount);
    console.log('Modified:', result.modifiedCount);
  } catch (err) {
    console.error('Error updating categories:', err);
  } finally {
    await client.close();
  }
}

fixCategories();