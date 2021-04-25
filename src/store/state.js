export default {
	is_loading: true,
	page: "",
	disPage: "",
	new_schedule_type: '', //1 表示全职, 2表示兼职
	rescheduleNum: {
		agreeNum: 0,
		checkNum: 0,
		rejectNum: 0
	},
	new_fulltime: {
		timeData: [],
		currentSchedule: 0,
		reservationSetting: '',
		remarksMsg: '',
		scheduleList: [{
			beginTime: '',
			endTime: '',
			needNum: '',
			timeSalaryRule: ''
		}]
	},
	new_parttime: {
		timeData: [],
		currentSchedule: 0,
		reservationSetting: '',
		remarksMsg: '',
		scheduleList: [{
			beginTime: '',
			endTime: '',
			needNum: '',
			timeSalaryRule: ''
		}]
	},
	salary_partTime: [
		{
			startTime: '',
			endTime: '',
			salary: ''
		}
	],
	salary_fullTime: [
		{
			startTime: '',
			endTime: '',
			salary: ''
		}
	]
}