let condition = {
	dailyLastHour: function(){
		let dt = new Date();
		if(dt.getHours() >= 22){
			return true;
		}
		return false;
	},
	weeklyFriLastHour: function(){
		let dt = new Date();
		if(dt.getDay() == 0 && dt.getHours() >= 22){
			return true;
		}
		return false;
	}
};

module.exports = condition;
