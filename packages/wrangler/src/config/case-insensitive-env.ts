export function caseInsensitiveEnv(): Record<string, string> {
	const tracked = new Map<string | symbol, string | symbol>();
	const targetObj = {} as Record<string, string>;

	const canonical = (property: string | symbol) =>
		typeof property === "string" ? property.toLowerCase() : property;

	// Writing a variable under a different casing to one already stored has to
	// remove the old key from the target, not just re-point `tracked` at the new
	// one. There is no `ownKeys` trap, so a key left behind on the target stays
	// enumerable and the object ends up with two entries for the same variable —
	// both resolving, via `get`, to the newer value.
	const forgetOtherCasing = (property: string | symbol) => {
		const previousProperty = tracked.get(canonical(property));
		if (previousProperty !== undefined && previousProperty !== property) {
			Reflect.deleteProperty(targetObj, previousProperty);
		}
	};

	return new Proxy(targetObj, {
		get(target, property, receiver) {
			const actualProperty = tracked.get(canonical(property));
			return actualProperty !== undefined
				? Reflect.get(target, actualProperty, receiver)
				: undefined;
		},
		set(target, property, value, receiver) {
			forgetOtherCasing(property);
			tracked.set(canonical(property), property);
			return Reflect.set(target, property, value, receiver);
		},
		has(target, property) {
			const actualProperty = tracked.get(canonical(property));
			return actualProperty !== undefined
				? Reflect.has(target, actualProperty)
				: false;
		},
		getOwnPropertyDescriptor(target, property) {
			const actualProperty = tracked.get(canonical(property));
			return actualProperty !== undefined
				? Reflect.getOwnPropertyDescriptor(target, actualProperty)
				: undefined;
		},
		defineProperty(target, property, descriptor) {
			forgetOtherCasing(property);
			tracked.set(canonical(property), property);
			return Reflect.defineProperty(target, property, descriptor);
		},
		deleteProperty(target, property) {
			// Delete the casing actually stored on the target. Deleting `property`
			// verbatim would leave the stored key behind and still enumerable, even
			// though every other trap now reports it as absent.
			const actualProperty = tracked.get(canonical(property)) ?? property;
			tracked.delete(canonical(property));
			return Reflect.deleteProperty(target, actualProperty);
		},
	});
}
