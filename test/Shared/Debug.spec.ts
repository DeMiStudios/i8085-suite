import { expect } from "chai";
import { describe, it } from "mocha";
import { assert, assertIsDefined } from "Shared/Debug";

describe("Test Debug library", () => {
	it("should not throw for a passed assertion", () => {
		expect(() => assert(true)).to.not.throw();
		expect(() => assertIsDefined(true)).to.not.throw();
	});

	it("should throw for a failed assertion", () => {
		expect(() => assert(false)).to.throw();
		expect(() => assertIsDefined(undefined)).to.throw();
	});
});
