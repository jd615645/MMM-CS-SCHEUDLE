Module.register("cs-schedule",{
	// Default module config.
	defaults: {
		updateSchedule: 1000 * 60 * 60,
	},

	// Define required scripts.
	getStyles() {
		return ["cs-schedule.css"];
	},

	start() {
		let self = this;
		setInterval(function () {
			console.log(self.config.updateSchedule);
			self.updateDom(); // no speed defined, so it updates instantly.
		}, self.config.updateSchedule); //perform every 1 hour.
	},

	async getDom() {
		let head = this.getScheduleHeader();
		let body = await this.getScheduleBody();

		let wrapper = document.createElement("table");
		wrapper.className = "schedule";

		let thead = document.createElement("thead");
		let tbody = document.createElement("tbody");

		let theadRow = document.createElement("tr");
		head.forEach(day => {
			let dateCell = document.createElement("th");

			dateCell.innerHTML = day;
			theadRow.appendChild(dateCell);
		});
		thead.appendChild(theadRow);

		body.forEach((row) => {
			let dateRow = document.createElement("tr");
			let mon = row["mon"] === null ? "X" : row["mon"].replace(",", "<br>");
			let tue = row["tue"] === null ? "X" : row["tue"].replace(",", "<br>");
			let wed = row["wed"] === null ? "X" : row["wed"].replace(",", "<br>");
			let thu = row["thu"] === null ? "X" : row["thu"].replace(",", "<br>");
			let fri = row["fri"] === null ? "X" : row["fri"].replace(",", "<br>");
			let sat = row["sat"] === null ? "X" : row["sat"].replace(",", "<br>");
			let sun = row["sun"] === null ? "X" : row["sun"].replace(",", "<br>");

			dateRow.innerHTML = `
				<td>${row["begin_time"]}-${row["end_time"]}</td>
				<td>${mon}</td>
				<td>${tue}</td>
				<td>${wed}</td>
				<td>${thu}</td>
				<td>${fri}</td>
				<td>${sat}</td>
				<td>${sun}</td>
			`;

			tbody.appendChild(dateRow);
		})

		wrapper.appendChild(thead);
		wrapper.appendChild(tbody);

		return wrapper;
	},

	getScheduleHeader() {
		let today = new Date().toISOString().slice(0, 10);
		let week = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
		let days = ["一", "二", "三", "四", "五", "六", "日"];

		let header = ["時間"];

		days.forEach((day, key) => {
			let date = this.getMonday(new Date(today)).toISOString(key).slice(0, 10);
			let weekText = `${date}<br>(${day})`;

			header.push(weekText);
		});

		return header;
	},

	async getScheduleBody() {
		let today = new Date().toISOString().slice(0, 10);
		let schedule_api = `https://cscc.cs.nctu.edu.tw/schedule_api/${today}`;
		let url = `https://jsonp.afeld.me/?url=${encodeURIComponent(schedule_api)}`;

		let fetchSchedule =
			await fetch(url)
				.then((res) => {
					return res.json();
				});

		return fetchSchedule;
	},

	getMonday(d) {
		d = new Date(d);
		let day = d.getDay()
		let	diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
		return new Date(d.setDate(diff));
	},
});
