describe("snapshot history", function(){
	function createSnapshot(time){
		return {
			time: time,
			networkEvents: [],
			networkEntities: {}
		};
	}

	function fillSnapshotHistory(sh, startTime, size) {
		for(var i=0; i<size; i++){
			sh.add(createSnapshot(startTime+i));
		}
	}

	it("add snapshot", function(){
		var sh = new Grape2D.SnapshotHistory(10);
		sh.add(createSnapshot(55));
		sh.add(createSnapshot(58));
		var history = sh.getHistory();
		expect(history.length).toBe(2);

		fillSnapshotHistory(sh, 59, 10);
		history = sh.getHistory();
		expect(history.length).toBe(10);
	});

	it("get before", function(){
		var sh = new Grape2D.SnapshotHistory(10);
		fillSnapshotHistory(sh, 189, 10);

		expect(sh.getBefore(180)).toBeNull();
		expect(sh.getBefore(189)).toBeNull();
		var first = sh.getBefore(190);
		expect(first).not.toBeNull();
		expect(first.time).toBe(189);
		var last = sh.getBefore(100000);
		expect(last).not.toBeNull();
		expect(last.time).toBe(198);
	});

	it("get after", function(){
		var sh = new Grape2D.SnapshotHistory(10);
		fillSnapshotHistory(sh, 189, 10);

		expect(sh.getAfter(200)).toBeNull();
		expect(sh.getAfter(199)).toBeNull();
		var last = sh.getAfter(197);
		expect(last).not.toBeNull();
		expect(last.time).toBe(198);
		var first = sh.getAfter(0);
		expect(first).not.toBeNull();
		expect(first.time).toBe(189);
	});

	it("get/set cap", function(){
		var sh = new Grape2D.SnapshotHistory(10);
		expect(sh.getCap()).toBe(10);
		sh.setCap(20);
		expect(sh.getCap()).toBe(20);

		fillSnapshotHistory(sh, 73, 20);
		expect(sh.getHistory().length).toBe(20);

		sh.setCap(13);
		expect(sh.getHistory().length).toBe(13);
		expect(sh.getBefore(1000).time).toBe(92);
		expect(sh.getAfter(0).time).toBe(80);
	});
});