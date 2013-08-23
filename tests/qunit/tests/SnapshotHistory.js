function fillSnapshotHistry(sh, size, startTime) {
	startTime = startTime || 0;
	for (var i = 0; i < size; i++) {
		sh.add(startTime+i, (startTime+i) + "");
	}
}
module("SnapshotHistory test");
test("Add test", function(){
	var sh = new Grape2D.SnapshotHistory(10);
	sh.add(55, "FIFTY-FIVE");
	sh.add(58, "FIFTY-EIGHT");
	var history = sh.getHistory();
	ok((history[0].time == 55) && (history[1].time == 58), "Add passed.");
	sh.add(59, "FIFTY-NINE");
	sh.add(60, "SIXTY");
	sh.add(61, "SIXTY-ONE");
	sh.add(62, "SIXTY-TWO");
	sh.add(63, "SIXTY-THREE");
	sh.add(64, "SIXTY-FOUR");
	sh.add(65, "SIXTY-FIVE");
	sh.add(66, "SIXTY-SIX");
	sh.add(67, "SIXTY-SEVEN");
	sh.add(68, "SIXTY-EIGHT");
	history = sh.getHistory();
	equal(history.length, 10, "History length has passed.");
	equal(history[0].time, 59, "Base entry has passed.");
	equal(history[sh.getCap()-1].time, 68, "Top entry has passed.");
});
test("GetBefore test", function(){
	var sh = new Grape2D.SnapshotHistory(10);
	fillSnapshotHistry(sh, 10, 5);
	equal(sh.getBefore(3), null, "Before firts passed.");
	equal(sh.getBefore(6), "5", "Before in the middle passed.");
	equal(sh.getBefore(19), "14", "Before at the end passed.");
});
test("GetAfter test", function(){
	var sh = new Grape2D.SnapshotHistory(10);
	fillSnapshotHistry(sh, 10, 5);
	console.log(sh);
	equal(sh.getAfter(3), "5", "After firts passed.");
	equal(sh.getAfter(6), "7", "After in the middle passed.");
	equal(sh.getAfter(19), null, "After at the end passed.");
});
test("Cap test", function() {
	var sh = new Grape2D.SnapshotHistory();
	equal(sh.getCap(), 10, "Default cap passed.");
	sh.setCap(5);
	equal(sh.getCap(), 5, "Set cap passed.");
	fillSnapshotHistry(sh, 5);
	sh.setCap(4);
	console.log(sh);
	ok((sh.getCap() == 4) && (sh.getHistory().length == 4), "Lowered cap passed.");
});