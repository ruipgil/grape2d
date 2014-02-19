/* global beforeEach, jasmine */
var customMatchers = {
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
	/*beforeEach(function() {
		jasmine.addMatchers(customMatchers);
	});*/
	beforeEach(function() {
		var matchers = {
			toBeOfType: function(typeString) {
				return typeof this.actual == typeString;
			}
		};

		this.addMatchers(matchers);
	});
}

