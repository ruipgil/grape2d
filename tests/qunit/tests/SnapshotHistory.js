function fillSnapshotHistry(sh, size, startTime) {
	startTime = startTime || 0;
	for (var i = 0; i < size; i++) {
		sh.add(new Grape2D.Snapshot(startTime+i));
	}
}
module("SnapshotHistory test");
test("Add test", function(){
	var sh = new Grape2D.SnapshotHistory(10);
	sh.add(new Grape2D.Snapshot(55));
	sh.add(new Grape2D.Snapshot(58));
	var history = sh.getHistory();
	ok((history[0].time == 55) && (history[1].time == 58), "Add passed.");
	sh.add(new Grape2D.Snapshot(59));
	sh.add(new Grape2D.Snapshot(60));
	sh.add(new Grape2D.Snapshot(61));
	sh.add(new Grape2D.Snapshot(62));
	sh.add(new Grape2D.Snapshot(63));
	sh.add(new Grape2D.Snapshot(64));
	sh.add(new Grape2D.Snapshot(65));
	sh.add(new Grape2D.Snapshot(66));
	sh.add(new Grape2D.Snapshot(67));
	sh.add(new Grape2D.Snapshot(68));
	history = sh.getHistory();
	equal(history.length, 10, "History length has passed.");
	equal(history[0].time, 59, "Base entry has passed.");
	equal(history[sh.getCap()-1].time, 68, "Top entry has passed.");
});
test("GetBefore test", function(){
	var sh = new Grape2D.SnapshotHistory(10);
	fillSnapshotHistry(sh, 10, 5);
	equal(sh.getBefore(3), null, "Before firts passed.");
	equal(sh.getBefore(6).time, 5, "Before in the middle passed.");
	equal(sh.getBefore(19).time, 14, "Before at the end passed.");
});
test("GetAfter test", function(){
	var sh = new Grape2D.SnapshotHistory(10);
	fillSnapshotHistry(sh, 10, 5);
	equal(sh.getAfter(3).time, 5, "After firts passed.");
	equal(sh.getAfter(6).time, 7, "After in the middle passed.");
	equal(sh.getAfter(19), null, "After at the end passed.");
});
test("Cap test", function() {
	var sh = new Grape2D.SnapshotHistory();
	equal(sh.getCap(), 10, "Default cap passed.");
	sh.setCap(5);
	equal(sh.getCap(), 5, "Set cap passed.");
	fillSnapshotHistry(sh, 5);
	sh.setCap(4);
	ok((sh.getCap() == 4) && (sh.getHistory().length == 4), "Lowered cap passed.");
});