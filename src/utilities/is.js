class booleanValidation {
   aBoolean = value => typeof value === 'boolean';
   
   anArray = value => Array.isArray(value);
   
   anInteger = value => Number.isInteger(value);
   
   anObject = value => typeof value === 'object' && !Array.isArray(value) && value !== null;
   
   aNumber = value => typeof value === 'number';
   
   aPopulatedArray = value => {
      if (!Array.isArray(value)) return false;
      return !!value.length;
   };
   
   aPopulatedObject = value => {
      if (this.nullOrUndefined(value)) return false;
      return (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length > 0);
   };
   
   aPopulatedString = value => typeof value === 'string' && value.trim() !== '';
   
   aPositiveInteger = value => this.anInteger(value) && value > 0;
   
   aString = value => typeof value === 'string';
   
   null = variable => variable === null;
   
   nullOrUndefined = variable => variable === undefined || variable === null;
   
   undefined = variable => variable === undefined;
}

const is = new booleanValidation();
export default is;