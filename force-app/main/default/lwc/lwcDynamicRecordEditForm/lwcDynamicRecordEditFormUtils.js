/**
 * @description deep copy of an object
 * @param {Object} obj
 * @returns {Object}
 */
export function deepCopy(obj) {
  if (Object(obj) !== obj) {
    return obj;
  }

  if (obj instanceof Set) {
    return new Set(obj);
  }

  if (obj instanceof Date) {
    return new Date(obj);
  }

  if (typeof obj === "function") {
    return obj.bind({});
  }

  if (Array.isArray(obj)) {
    const obj2 = [];
    const len = obj.length;

    for (let i = 0; i < len; i++) {
      obj2.push(deepCopy(obj[i]));
    }

    return obj2;
  }
  const result = Object.create({});
  let keys = Object.keys(obj);

  if (obj instanceof Error) {
    keys = Object.getOwnPropertyNames(obj);
  }
  const len = keys.length;
  for (let i = 0; i < len; i++) {
    const key = keys[i];
    result[key] = deepCopy(obj[key]);
  }
  return result;
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
export function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  return (
    s4() +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    s4() +
    s4()
  );
}
