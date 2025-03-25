export const initializeExistingPrefixes = () => {
  /**
   * Initializes existing prefixes for products, participants, and ownerships from localStorage.
   */
  const types = ["product", "participant", "ownership"];

  /** Get the identifiers of the corresponding type*/
  types.forEach((type) => {
    const storedIds: string[] = JSON.parse(
      localStorage.getItem(`${type}Ids`) || "[]"
    );
    storedIds.forEach((id) => {
      const parts = id.split("-");
      if (parts.length > 2) {
        /** Create the prefix with the first two segments and an extra delimiter*/ const prefix = `${parts
          .slice(0, 2)
          .join("-")}-`;
        existingPrefixes[type].add(prefix);
      }
    });
  });
};

/** Index to store items by their initial number */
let itemIndex: { [key: string]: string[] } = {};

/** Sets to store existing prefixes by type */
const existingPrefixes: { [key: string]: Set<string> } = {
  // Conjuntos para almacenar prefijos existentes por tipo
  product: new Set(),
  participant: new Set(),
  ownership: new Set(),
};

/** Interface for objects that can be stored in localStorage */
type StorableObject = {
  id: string;
  [key: string]: any; // Permitir otras propiedades
};

/**
 * Adds an item to localStorage and updates related data structures.
 *
 * @param object - The object to be stored
 * @param itemType - The type of the item (e.g., "product", "participant", "ownership")
 */
export const addItemToLocalStorage = (
  object: StorableObject,
  itemType: string
) => {
  // console.log("ProductId en addProductToLocalStorage", itemId);
  const itemKey = object.id;
  let itemsArrayKey: string = "";

  switch (itemType) {
    case "product":
      itemsArrayKey = "productIds";
      break;
    case "participant":
      itemsArrayKey = "participantIds";
      break;
    case "ownership":
      itemsArrayKey = "ownershipIds";
      break;
    default:
      throw new Error(`Unknown itemType: ${itemType}`);
  }
  const itemIds: Set<string> = new Set(
    JSON.parse(localStorage.getItem(itemsArrayKey) || "[]")
  );

  /** Split the itemKey to get the base prefix (e.g. product-3) */
  const itemPrefix = itemKey.split("-").slice(0, 2).join("-") + "-"; // Ej: product-3-

  /** Check if an item with the same prefix already exists */
  if (existingPrefixes[itemType].has(itemPrefix)) {
    // console.log(`${itemType} with prefix ${itemPrefix} already exists!`);
    return;
  }

  /** Create the array if there are no elements */
  const initialNumber = itemPrefix.split("-")[1];
  if (!itemIndex[initialNumber]) {
    itemIndex[initialNumber] = [];
  }
  /** Add the itemKey to the index */
  itemIndex[initialNumber].push(itemKey);
  /** Add the prefix to the set of existing prefixes */
  existingPrefixes[itemType].add(itemPrefix);
  /** Add the itemKey to the set od Ids */
  itemIds.add(itemKey);

  /** Update set with new ID */
  localStorage.setItem(itemsArrayKey, JSON.stringify(Array.from(itemIds)));
  /** Store product data */
  localStorage.setItem(itemKey, JSON.stringify(object));
  // console.log(`${itemType} añadido:`, itemKey);
};

/**
 * Finds products in localStorage by their initial number.
 *
 * @param initialNumber - The initial number to search for
 * @returns An array of product objects
 */
export function findProductsByInitialNumber(initialNumber: number) {
  const results: Object[] = [];
  /** Iterate through all items in localStorage */
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    /** Check if the key matches the product pattern with the given initial number*/
    if (key && key.startsWith(`product-${initialNumber.toString()}-`)) {
      const productString = localStorage.getItem(key);

      /** If the product exists, parse it and add to results */
      if (productString) {
        const product: Object = JSON.parse(productString);
        results.push(product);
      }
    }
  }
  return results;
}

/**
 * Finds items in localStorage by their initial numbers and type.
 *
 * @param initialNumbers - An array of initial numbers to search for
 * @param itemType - The type of items to search for (e.g., "product", "participant", "ownership")
 * @returns An array of item objects
 */
export function findItemsByInitialNumbers(
  initialNumbers: number[],
  itemType: string
): any[] {
  const results: any[] = [];

  /** Iterate through all items in localStorage */
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    /** For each initial number, check if the key matches the pattern */
    if (key) {
      initialNumbers.forEach((initialNumber) => {
        const prefix = `${itemType}-${initialNumber.toString()}-`;
        if (key.startsWith(prefix)) {
          const itemString = localStorage.getItem(key);
          // console.log(`-------${itemType}String en findItemsByInitialNumbers:------`, itemString);

          /** If the item exists, parse it and add to results */
          if (itemString) {
            const item = JSON.parse(itemString);
            // console.log(`-------${itemType} en findItemsByInitialNumbers:------`, item);
            results.push(item);
          }
        }
      });
    }
  }
  return results;
}
