const { publicEncrypt, privateDecrypt, generateKeyPairSync } = require('crypto');
const secure = require("crypto-js/sha256");

class Hash {
	constructor(index, time, data, prev = '') {
		this.index = index;
		this.time = time;
		this.data = data;
		this.prev = prev;
		this.hash = this.calculate();
		this.nonce = 0;
	}

	calculate() {
		return secure(this.index + this.prev + this.time + JSON.stringify(this.data) + this.nonce).toString();
	}

	mining(difficulty) {
		while (
			this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
		) {
			this.nonce++;
			this.hash = this.calculate();
		}
	}
}

class Protocol {
	constructor() {
		this.protocol = [this.genesis()];
		this.difficulty = 4;
	}

	genesis() {
		return new Hash(0, "01/01/2020", "you alr know its ya boy genesis on chain", "0");
	}

	fetch() {
		return this.protocol[this.protocol.length - 1];
	}

	add(input) {
		input.prev = this.fetch().hash;
		input.hash = input.calculate();
		input.mining(this.difficulty);
		this.protocol.push(input);
	}

	validity() {
		for (let i = 1; i < this.protocol.length; i++) {
			const current = this.protocol[i];
			const last = this.protocol[i - 1];
			const decrypted = decryptedData.toString('utf-8');

			if (current.hash !== current.calculate()) {
				return 'Not Mined. Current hash is invalid';
			} else if (current.prev !== last.hash) {
				return 'Not Mined. Previous hash is invalid';
			} else if (decrypted !== message) {
				return 'Not Mined. Invalid Data';
			}
		} return 'Mined! Chain is Valid!';
	}
}

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
	modulusLength: 2048,
	publicKeyEncoding: {
		type: 'spki', format: 'pem',
	},
	privateKeyEncoding: {
		type: 'pkcs8', format: 'pem',
	},
});

const message = 'Transaction';
let hackercoin = new Protocol();

const encryptedData = publicEncrypt(
	publicKey,
	Buffer.from(message)
);
const decryptedData = privateDecrypt(
	privateKey,
	encryptedData
);

console.log("mining... ");
hackercoin.add(
	new Hash(1, "01/06/2020", {
		sender: "Fiona Hacksworth",
		recipient: "Rajan Agarwal",
		encrypted: encryptedData.toString('hex'),
		pubKey: publicKey,
		validity: hackercoin.validity(),
		quantity: 50
	})
);

console.log(JSON.stringify(hackercoin, null, 4));