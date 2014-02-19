/* global beforeEach, jasmine */
/*var customMatchers = {
	toBeApproximately: function(util, customEqualityTesters){
		return {
			compare: function(actual, expected){
				var EPSILON = 0.00000001;
				if(expected === undefined){
					expected = '';
				}
				var result = {},
					lb = (expected-EPSILON),
					hb = (expected+EPSILON);
				result.pass = ( lb <= actual && actual <= hb );
				if(result.pass){
					result.message = "Expected "+actual+" to be between "+lb+" and "+hb+".";
				}else{
					result.message = "Expected "+actual+" to be between "+lb+" and "+hb+", but was not.";
				}
				return result;
			}
		};
	}
};

function addCustomMatchers(){
	if(jasmine.hasOwnProperty("addMatchers")){
		//jasmine@2.0.0
		beforeEach(function() {
			jasmine.addMatchers(customMatchers);
		});
	}else{
		//jasmine@<2.0.0
		beforeEach(function() {
			this.addMatchers(customMatchers);
		});
	}
}

module.exports = {
	addCustomMatchers: addCustomMatchers
};*/
