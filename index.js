import "dotenv/config";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

/**
 * Converts a number to its corresponding alphabetical representation in uppercase.
 * 1 -> 'A', 2 -> 'B', ..., 26 -> 'Z', 27 -> 'AA', etc.
 * @param {number} num - The number to convert.
 * @returns {string} The alphabetical representation in uppercase.
 */
const numberToLetters = (num) => {
  if (num < 1) return '';

  let result = '';
  while (num > 0) {
    num--; // Adjust because 'A' starts at 1
    const charCode = 65 + (num % 26); // 65 = 'A'.charCodeAt(0)
    result = String.fromCharCode(charCode) + result;
    num = Math.floor(num / 26);
  }

  return result;
}

const callSalesApi = async (path, method, payload) => {
  const response = await fetch(process.env.SALES_API_URL + path, {
    method,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    ...(payload && { body: JSON.stringify(payload) }),
  });

  const data = await response.json();

  return data;
};

const data = [];
for (let i = 2; i <= 100; i++) {
  const transaction = {
    dataSource: "Web Sales",
    permissions: [
      {
        permitId: "d91b34a0-0c66-e611-80dc-c4346bad0190",
        licensee: {
          preferredMethodOfNewsletter: "Prefer not to be contacted",
          firstName: "Performance",
          lastName: `Test ${numberToLetters(i)}`,
          birthDate: moment().subtract(14, 'years').format('YYYY-MM-DD'), // Junior license for 14 year old
          premises: "10",
          street: "Downing Street",
          town: "London",
          postcode: "SW1A 2AB",
          organisation: null,
          postalFulfilment: false,
          preferredMethodOfConfirmation: "Email",
          preferredMethodOfReminder: "Email",
          email: "someone@example.com",
          mobilePhone: null,
          country: "England",
        },
        issueDate: null,
        startDate: null,
        isLicenceForYou: true,
        concessions: [
          {
            id: "3230c68f-ef65-e611-80dc-c4346bad4004",
            proof: {
              type: "No Proof",
            },
          },
        ],
      },
    ],
  };
  transaction.transactionId = uuidv4();

  console.log("transaction to insert");
  console.log(JSON.stringify(transaction, null, 2));

  const createdTransaction = await callSalesApi(
    "/transactions",
    "post",
    transaction
  );

  console.log("createdTransaction result");
  console.log(JSON.stringify(createdTransaction, null, 2));

  const apiFinalisationPayload = {
    payment: {
      amount: 0,
      timestamp: moment().toISOString(),
      source: "Gov Pay",
      method: "Debit card",
    },
  };

  console.log("apiFinalisationPayload");
  console.log(JSON.stringify(apiFinalisationPayload, null, 2));

  const finalisedTransaction = await callSalesApi(
    `/transactions/${transaction.transactionId}`,
    "PATCH",
    apiFinalisationPayload
  );

  console.log("finalisedTransaction result");
  console.log(JSON.stringify(finalisedTransaction, null, 2));

  const licence = finalisedTransaction.permissions[0].referenceNumber;
  const postcode = transaction.permissions[0].licensee.postcode;

  data.push({ licence, postcode });
}

for (let i = 0; i < data.length; i++) {
  const lastHyphen = data[i].licence.lastIndexOf("-");
  const last6Characters = data[i].licence.substring(lastHyphen + 1);
  console.log(last6Characters + ", " + data[i].postcode);
}
