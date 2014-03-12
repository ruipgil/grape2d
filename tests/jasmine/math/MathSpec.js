describe("Math namespace", function(){

	addCustomMatchers();
	describe("abs function", function(){
		it("Zero", function(){
			expect(Grape2D.Math.abs(0)).toBe(0);
		});
		it("Positive integer", function(){
			expect(Grape2D.Math.abs(54331)).toBe(54331);
		});
		it("Negative integer", function(){
			expect(Grape2D.Math.abs(-54331)).toBe(54331);
		});
		it("Positive float", function(){
			expect(Grape2D.Math.abs(87654.13215)).toBe(87654.13215);
		});
		it("Negative float", function(){
			expect(Grape2D.Math.abs(-87654.13215)).toBe(87654.13215);
		});
	});

	describe("floor function", function(){
		it("Zero", function(){
			expect(Grape2D.Math.floor(0)).toBe(0);
		});
		it("Positive integer", function(){
			expect(Grape2D.Math.floor(48445)).toBe(48445);
		});
		it("Negative integer", function(){
			expect(Grape2D.Math.floor(-8451232)).toBe(-8451232);
		});
		it("Positive float", function(){
			expect(Grape2D.Math.floor(1.13215)).toBe(1);
		});
		it("Negative float", function(){
			expect(Grape2D.Math.floor(-6348.84311215)).toBe(-6349);
		});
	});

	//TODO create cases where floorPositive fails
	describe("floorPositive function", function(){
		it("Zero", function(){
			expect(Grape2D.Math.floor(0)).toBe(0);
		});
		it("Positive integer", function(){
			expect(Grape2D.Math.floor(48445)).toBe(48445);
		});
		it("Negative integer", function(){
			expect(Grape2D.Math.floor(-8451232)).toBe(-8451232);
		});
		it("Positive float", function(){
			expect(Grape2D.Math.floor(1.13215)).toBe(1);
		});
		it("Negative float", function(){
			expect(Grape2D.Math.floor(-6348.84311215)).toBe(-6349);
		});
	});

	describe("ceil function", function(){
		it("Zero", function(){
			expect(Grape2D.Math.ceil(0)).toBe(0);
		});
		it("Positive integer", function(){
			expect(Grape2D.Math.ceil(48445)).toBe(48445);
		});
		it("Negative integer", function(){
			expect(Grape2D.Math.ceil(-8451232)).toBe(-8451232);
		});
		it("Positive float", function(){
			expect(Grape2D.Math.ceil(956348.8431121)).toBe(956349);
		});
		it("Negative float", function(){
			expect(Grape2D.Math.ceil(-6348.84311215)).toBe(-6348);
		});
	});

	describe("round function", function(){
		it("Zero", function(){
			expect(Grape2D.Math.round(0)).toBe(0);
		});
		it("Positive integer", function(){
			expect(Grape2D.Math.round(48445)).toBe(48445);
		});
		it("Negative integer", function(){
			expect(Grape2D.Math.round(-8451232)).toBe(-8451232);
		});
		it("Positive float ceiled", function(){
			expect(Grape2D.Math.round(956348.8431121)).toBe(956349);
		});
		it("Positive float floored", function(){
			expect(Grape2D.Math.round(956348.2431121)).toBe(956348);
		});
		it("Negative float ceiled", function(){
			expect(Grape2D.Math.round(-6348.8431121)).toBe(-6349);
		});
		it("Negative float floored", function(){
			expect(Grape2D.Math.round(-6348.44311215)).toBe(-6348);
		});
	});

	describe("roundOne function", function(){
		it("Zero", function(){
				expect(Grape2D.Math.roundOne(0)).toBeApproximately(0);
			});
			it("Positive integer", function(){
				expect(Grape2D.Math.roundOne(48445)).toBeApproximately(48445);
			});
			it("Negative integer", function(){
				expect(Grape2D.Math.roundOne(-8451232)).toBeApproximately(-8451232);
			});
			it("Positive float ceiled", function(){
				expect(Grape2D.Math.roundOne(956348.8531121)).toBeApproximately(956348.9);
			});
			it("Positive float floored", function(){
				expect(Grape2D.Math.roundOne(956348.2431121)).toBeApproximately(956348.2);
			});
			it("Negative float ceiled", function(){
				expect(Grape2D.Math.roundOne(-6348.8831121)).toBeApproximately(-6348.9);
			});
			it("Negative float floored", function(){
				expect(Grape2D.Math.roundOne(-6348.44311215)).toBeApproximately(-6348.4);
			});
	});

	describe("roundTwo function", function(){
		it("Zero", function(){
			expect(Grape2D.Math.roundTwo(0)).toBeApproximately(0);
		});
		it("Positive integer", function(){
			expect(Grape2D.Math.roundTwo(48445)).toBeApproximately(48445);
		});
		it("Negative integer", function(){
			expect(Grape2D.Math.roundTwo(-8451232)).toBeApproximately(-8451232);
		});
		it("Positive float ceiled", function(){
			expect(Grape2D.Math.roundTwo(956348.8571121)).toBeApproximately(956348.86);
		});
		it("Positive float floored", function(){
			expect(Grape2D.Math.roundTwo(956348.2431121)).toBeApproximately(956348.24);
		});
		it("Negative float ceiled", function(){
			expect(Grape2D.Math.roundTwo(-6348.8851121)).toBeApproximately(-6348.89);
		});
		it("Negative float floored", function(){
			expect(Grape2D.Math.roundTwo(-6348.44311215)).toBeApproximately(-6348.44);
		});
	});

	describe("roundThree function", function(){
		it("Zero", function(){
			expect(Grape2D.Math.roundThree(0)).toBeApproximately(0);
		});
		it("Positive integer", function(){
			expect(Grape2D.Math.roundThree(48445)).toBeApproximately(48445);
		});
		//TOFIX
		xit("Negative integer", function(){
			expect(Grape2D.Math.roundThree(-8451232)).toBeApproximately(-8451232);
		});
		it("Positive float ceiled", function(){
			expect(Grape2D.Math.roundThree(956348.8555121)).toBeApproximately(956348.856);
		});
		it("Positive float floored", function(){
			expect(Grape2D.Math.roundThree(956348.2431121)).toBeApproximately(956348.243);
		});
		it("Negative float ceiled", function(){
			expect(Grape2D.Math.roundThree(-6348.8858121)).toBeApproximately(-6348.886);
		});
		it("Negative float floored", function(){
			expect(Grape2D.Math.roundThree(-6348.44311215)).toBeApproximately(-6348.443);
		});
	});

	//TOFIX
	/*xdescribe("roundFour function", function(){
		it("Zero", function(){
			expect(Grape2D.Math.roundFour(0)).toBeApproximately(0);
		});
		it("Positive integer", function(){
			expect(Grape2D.Math.roundFour(48445)).toBeApproximately(48445);
		});
		xit("Negative integer", function(){
			expect(Grape2D.Math.roundFour(-8451232)).toBeApproximately(-8451232);
		});
		it("Positive float ceiled", function(){
			expect(Grape2D.Math.roundFour(956348.851259)).toBeApproximately(956348.8513);
		});
		it("Positive float floored", function(){
			expect(Grape2D.Math.roundFour(956348.2431121)).toBeApproximately(956348.2431);
		});
		it("Negative float ceiled", function(){
			expect(Grape2D.Math.roundFour(-6348.8858621)).toBeApproximately(-6348.8858);
		});
		it("Negative float floored", function(){
			expect(Grape2D.Math.roundFour(-6348.44311215)).toBeApproximately(-6348.4431);
		});
	});*/

	describe("roundN function", function(){
		describe("with n=0", function(){
			it("Zero", function(){
				expect(Grape2D.Math.roundN(0, 0)).toBe(0);
			});
			it("Positive integer", function(){
				expect(Grape2D.Math.roundN(48445, 0)).toBe(48445);
			});
			it("Negative integer", function(){
				expect(Grape2D.Math.roundN(-8451232, 0)).toBe(-8451232);
			});
			it("Positive float ceiled", function(){
				expect(Grape2D.Math.roundN(956348.8431121, 0)).toBe(956349);
			});
			it("Positive float floored", function(){
				expect(Grape2D.Math.roundN(956348.2431121, 0)).toBe(956348);
			});
			it("Negative float ceiled", function(){
				expect(Grape2D.Math.roundN(-6348.8431121, 0)).toBe(-6349);
			});
			it("Negative float floored", function(){
				expect(Grape2D.Math.roundN(-6348.44311215, 0)).toBe(-6348);
			});
		});
		describe("with n=1", function(){
			it("Zero", function(){
				expect(Grape2D.Math.roundN(0, 1)).toBeApproximately(0);
			});
			it("Positive integer", function(){
				expect(Grape2D.Math.roundN(48445, 1)).toBeApproximately(48445);
			});
			it("Negative integer", function(){
				expect(Grape2D.Math.roundN(-8451232, 1)).toBeApproximately(-8451232);
			});
			it("Positive float ceiled", function(){
				expect(Grape2D.Math.roundN(956348.8531121, 1)).toBeApproximately(956348.9);
			});
			it("Positive float floored", function(){
				expect(Grape2D.Math.roundN(956348.2431121, 1)).toBeApproximately(956348.2);
			});
			it("Negative float ceiled", function(){
				expect(Grape2D.Math.roundN(-6348.8831121, 1)).toBeApproximately(-6348.9);
			});
			it("Negative float floored", function(){
				expect(Grape2D.Math.roundN(-6348.44311215, 1)).toBeApproximately(-6348.4);
			});
		});
		//TOFIX
		xdescribe("with n=6", function(){
			it("Zero", function(){
				expect(Grape2D.Math.roundN(0, 6)).toBeApproximately(0);
			});
			it("Positive integer", function(){
				expect(Grape2D.Math.roundN(48445, 6)).toBeApproximately(48445);
			});
			it("Negative integer", function(){
				expect(Grape2D.Math.roundN(-8451232, 6)).toBeApproximately(-8451232);
			});
			it("Positive float ceiled", function(){
				expect(Grape2D.Math.roundN(956348.8531121, 6)).toBeApproximately(956348.9);
			});
			it("Positive float floored", function(){
				expect(Grape2D.Math.roundN(956348.2431121, 6)).toBeApproximately(956348.2);
			});
			it("Negative float ceiled", function(){
				expect(Grape2D.Math.roundN(-6348.8831121, 6)).toBeApproximately(-6348.9);
			});
			it("Negative float floored", function(){
				expect(Grape2D.Math.roundN(-6348.44311215, 6)).toBeApproximately(-6348.4);
			});
		});
	});

	describe("min function", function(){
		it("between negative integer and negative integer", function(){
			expect(Grape2D.Math.min(-84541, -985641)).toBe(-985641);
			expect(Grape2D.Math.min(-985641, -84541)).toBe(-985641);
		});
		it("between negative integer and positive integer", function(){
			expect(Grape2D.Math.min(-84541, 613458)).toBe(-84541);
			expect(Grape2D.Math.min(613458, -84541)).toBe(-84541);
		});
		it("between positive integer and positive integer", function(){
			expect(Grape2D.Math.min(5, 8978798513)).toBe(5);
			expect(Grape2D.Math.min(8978798513, 5)).toBe(5);
		});
		it("between negative float and negative float", function(){
			expect(Grape2D.Math.min(-8484357.1546451, -8484357.1546453)).toBe(-8484357.1546453);
			expect(Grape2D.Math.min(-8484357.1546453, -8484357.1546451)).toBe(-8484357.1546453);
		});
		it("between negative float and positive float", function(){
			expect(Grape2D.Math.min(-8484357.1546451, 8484357.1546453)).toBe(-8484357.1546451);
			expect(Grape2D.Math.min(8484357.1546453, -8484357.1546451)).toBe(-8484357.1546451);
		});
		it("between positive float and positive float", function(){
			expect(Grape2D.Math.min(8484357.1546451, 8484357.1546453)).toBe(8484357.1546451);
			expect(Grape2D.Math.min(8484357.1546453, 8484357.1546451)).toBe(8484357.1546451);
		});
		it("between float and integer", function(){
			expect(Grape2D.Math.min(8484357.1546451, 8484357)).toBe(8484357);
			expect(Grape2D.Math.min(8484357, 8484357.1546453)).toBe(8484357);
		});
	});

	describe("max function", function(){
		it("between negative integer and negative integer", function(){
			expect(Grape2D.Math.max(-84541, -985641)).toBe(-84541);
			expect(Grape2D.Math.max(-985641, -84541)).toBe(-84541);
		});
		it("between negative integer and positive integer", function(){
			expect(Grape2D.Math.max(-84541, 613458)).toBe(613458);
			expect(Grape2D.Math.max(613458, -84541)).toBe(613458);
		});
		it("between positive integer and positive integer", function(){
			expect(Grape2D.Math.max(5, 8978798513)).toBe(8978798513);
			expect(Grape2D.Math.max(8978798513, 5)).toBe(8978798513);
		});
		it("between negative float and negative float", function(){
			expect(Grape2D.Math.max(-8484357.1546451, -8484357.1546453)).toBe(-8484357.1546451);
			expect(Grape2D.Math.max(-8484357.1546453, -8484357.1546451)).toBe(-8484357.1546451);
		});
		it("between negative float and positive float", function(){
			expect(Grape2D.Math.max(-8484357.1546451, 8484357.1546453)).toBe(8484357.1546453);
			expect(Grape2D.Math.max(8484357.1546453, -8484357.1546451)).toBe(8484357.1546453);
		});
		it("between positive float and positive float", function(){
			expect(Grape2D.Math.max(8484357.1546451, 8484357.1546453)).toBe(8484357.1546453);
			expect(Grape2D.Math.max(8484357.1546453, 8484357.1546451)).toBe(8484357.1546453);
		});
		it("between float and integer", function(){
			expect(Grape2D.Math.max(8484357.1546451, 8484357)).toBe(8484357.1546451);
			expect(Grape2D.Math.max(8484357, 8484357.1546453)).toBe(8484357.1546453);
		});
	});


	describe("clamp function", function(){
		describe("clamped to lower bound", function(){
			it("between negative and negative", function(){
				expect(Grape2D.Math.clamp(-9954,-9,-1)).toBe(-9);
				expect(Grape2D.Math.clamp(-9954.9646,-9.1,-1.13)).toBe(-9.1);
			});
			it("between negative and zero", function(){
				expect(Grape2D.Math.clamp(-15421,-65,0)).toBe(-65);
				expect(Grape2D.Math.clamp(-15421.124,-65.6854,0)).toBe(-65.6854);
			});
			it("between zero and zero", function(){
				expect(Grape2D.Math.clamp(-954,0,0)).toBe(0);
				expect(Grape2D.Math.clamp(-954.784413,0,0)).toBe(0);
			});
			it("between zero and positive", function(){
				expect(Grape2D.Math.clamp(-5645,0,54)).toBe(0);
				expect(Grape2D.Math.clamp(-5645.316,0,54.546)).toBe(0);
			});
			it("between positive and positive", function(){
				expect(Grape2D.Math.clamp(15,16,1234)).toBe(16);
				expect(Grape2D.Math.clamp(15.1345,16.54,1234.154)).toBe(16.54);
			});
			it("between negative and positive", function(){
				expect(Grape2D.Math.clamp(-1111,-135,158)).toBe(-135);
				expect(Grape2D.Math.clamp(-1111.87124,-135.68453,158.42134)).toBe(-135.68453);
			});
		});
		describe("clamped to upper bound", function(){
			it("between negative and negative", function(){
				expect(Grape2D.Math.clamp(-8,-95,-11)).toBe(-11);
			});
			it("between negative and zero", function(){
				expect(Grape2D.Math.clamp(124,-65,0)).toBe(0);
			});
			it("between zero and zero", function(){
				expect(Grape2D.Math.clamp(34,0,0)).toBe(0);
			});
			it("between zero and positive", function(){
				expect(Grape2D.Math.clamp(154,0,54)).toBe(54);
			});
			it("between positive and positive", function(){
				expect(Grape2D.Math.clamp(2540,16,1234)).toBe(1234);
			});
			it("between negative and positive", function(){
				expect(Grape2D.Math.clamp(200,-135,158)).toBe(158);
			});
		});
		describe("don't clamp", function(){
			it("between negative and negative", function(){
				expect(Grape2D.Math.clamp(-81,-95,-11)).toBe(-81);
			});
			it("between negative and zero", function(){
				expect(Grape2D.Math.clamp(-3,-65,0)).toBe(-3);
			});
			it("between zero and zero", function(){
				expect(Grape2D.Math.clamp(0,0,0)).toBe(0);
			});
			it("between zero and positive", function(){
				expect(Grape2D.Math.clamp(21,0,54)).toBe(21);
			});
			it("between positive and positive", function(){
				expect(Grape2D.Math.clamp(56,16,1234)).toBe(56);
			});
			it("between negative and positive", function(){
				expect(Grape2D.Math.clamp(134,-135,158)).toBe(134);
			});
		});
	});

	describe("overlaps function", function(){
		describe("overlapping", function(){
			it("negative intervals", function(){
				expect(Grape2D.Math.overlaps({min: -8, max: -3}, {min:-4, max:-1})).toBe(1);
			});
			it("negative and positive intervals", function(){
				expect(Grape2D.Math.overlaps({min: -8, max: 1}, {min:1, max:3})).toBe(0);
			});
			it("positive intervals", function(){
				expect(Grape2D.Math.overlaps({min: 2, max: 8}, {min:7.5, max:10})).toBe(0.5);
			});
		});
		describe("not overlapping", function(){
			it("negative intervals", function(){
				expect(Grape2D.Math.overlaps({min: -8, max: -3}, {min:-2, max:-1})).toBe(-1);
			});
			it("negative and positive intervals", function(){
				expect(Grape2D.Math.overlaps({min: -8, max: 1}, {min:1.1, max:8})).toBeApproximately(-0.1);
			});
			it("positive intervals", function(){
				expect(Grape2D.Math.overlaps({min: 2, max: 8}, {min:8.1, max:10})).toBeApproximately(-0.1);
			});
		});
	});

	describe("sq function", function(){
		it("Zero", function(){
			expect(Grape2D.Math.sq(0)).toBe(0);
		});
		it("Positive integer", function(){
			expect(Grape2D.Math.sq(85)).toBe(7225);
		});
		it("Negative integer", function(){
			expect(Grape2D.Math.sq(-8)).toBe(64);
		});
		it("Positive float", function(){
			expect(Grape2D.Math.sq(894.54)).toBeApproximately(800201.8116);
		});
		it("Negative float", function(){
			expect(Grape2D.Math.sq(-34.58)).toBeApproximately(1195.7764);
		});
	});

	describe("isPowerOfTwo function", function(){
		it("when is power of two", function(){
			expect(Grape2D.Math.isPowerOfTwo(1)).toBe(true);
			expect(Grape2D.Math.isPowerOfTwo(1024)).toBe(true);
			expect(Grape2D.Math.isPowerOfTwo(2048)).toBe(true);
		});
		it("when isn't power of two", function(){
			expect(Grape2D.Math.isPowerOfTwo(0)).not.toBe(true);
			expect(Grape2D.Math.isPowerOfTwo(3)).not.toBe(true);
			expect(Grape2D.Math.isPowerOfTwo(5)).not.toBe(true);
			expect(Grape2D.Math.isPowerOfTwo(1023)).not.toBe(true);
			expect(Grape2D.Math.isPowerOfTwo(1025)).not.toBe(true);
			expect(Grape2D.Math.isPowerOfTwo(2047)).not.toBe(true);
			expect(Grape2D.Math.isPowerOfTwo(2049)).not.toBe(true);
		});
	});

	describe("nextPowerOfTwo function", function(){
		it("next power of two", function(){
			expect(Grape2D.Math.nextPowerOfTwo(0)).toBe(0);
			expect(Grape2D.Math.nextPowerOfTwo(1)).toBe(1);
			expect(Grape2D.Math.nextPowerOfTwo(2)).toBe(2);
			expect(Grape2D.Math.nextPowerOfTwo(3)).toBe(4);
			expect(Grape2D.Math.nextPowerOfTwo(1023)).toBe(1024);
		});
	});

});