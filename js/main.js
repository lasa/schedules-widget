(function ($){
  
    // Setupt the default schedules
    var normalA = {
        name: "normal A schedule",
        days: ["mon"],
        periods: [
            {
                name:   "1st",
                start:  "8:15",
                end:    "9:50"
            },
            {
                name:   "2nd",
                start:  "9:55",
                end:    "11:25"
            },
            {
                name:   "3rd",
                start:  "11:35",
                end:    "13:05"
            },
            {
                name:   "lunch",
                start:  "13:05",
                end:    "14:00"
            },
            {
                name:   "4th",
                start:  "14:05",
                end:    "15:40"
            }
        ]
    };

    var normalB = {
        name: "normal B schedule",
        days: ["tue", "thu"],
        periods: [
            {
                name:   "5th",
                start:  "8:15",
                end:    "9:50"
            },
            {
                name:   "6th",
                start:  "9:55",
                end:    "11:25"
            },
            {
                name:   "7th",
                start:  "11:35",
                end:    "13:05"
            },
            {
                name:   "lunch",
                start:  "13:05",
                end:    "14:00"
            },
            {
                name:   "8th",
                start:  "14:05",
                end:    "15:40"
            },
            {
                name:   "9th",
                start:  "15:45",
                end:    "23:40"
            }
        ]
    };

    var advisory = {
        name: "advisory schedule",
        days: ["wed"],
        periods: [
            {
                name:   "1st",
                start:  "8:15",
                end:    "9:40"
            },
            {
                name:   "advisory",
                start:  "9:45",
                end:    "10:25"
            },
            {
                name:   "2nd",
                start:  "10:30",
                end:    "11:50"
            },
            {
                name:   "3rd",
                start:  "11:55",
                end:    "13:15"
            },
            {
                name:   "lunch",
                start:  "13:15",
                end:    "14:10"
            },
            {
                name:   "4th",
                start:  "14:15",
                end:    "15:40"
            }
        ]
    };

    var lateStart = {
        name: "normal A schedule",
        days: [],
        periods: [
            {
                name:   "5th",
                start:  "8:15",
                end:    "9:50"
            },
            {
                name:   "6th",
                start:  "9:55",
                end:    "11:25"
            },
            {
                name:   "7th",
                start:  "11:35",
                end:    "13:05"
            },
            {
                name:   "lunch",
                start:  "13:05",
                end:    "14:00"
            },
            {
                name:   "8th",
                start:  "14:05",
                end:    "15:40"
            }
        ]
    };

    var genericFriday = {
        name: "friday",
        days: ["fri"],
        periods: [
            {
                name:   "1st/5th",
                start:  "8:15",
                end:    "9:50"
            },
            {
                name:   "2nd/6th",
                start:  "9:55",
                end:    "11:25"
            },
            {
                name:   "3rd/7th",
                start:  "11:35",
                end:    "13:05"
            },
            {
                name:   "lunch",
                start:  "13:05",
                end:    "14:00"
            },
            {
                name:   "4th/8th",
                start:  "14:05",
                end:    "15:40"
            }
        ]
    };

    var noSchool = {name: 'noschool',
        periods: [
            {
                name:   "1st/5th",
                start:  "8:15",
                end:    "9:50"
            },
            {
                name:   "2nd/6th",
                start:  "9:55",
                end:    "11:25"
            },
            {
                name:   "3rd/7th",
                start:  "11:35",
                end:    "13:05"
            },
            {
                name:   "lunch",
                start:  "13:05",
                end:    "14:00"
            },
            {
                name:   "4th/8th",
                start:  "14:05",
                end:    "15:40"
            }
        ]};

    var week = {
        "mon" : normalA,
        "tue" : normalB,
        "wed" : advisory,
        "thu" : normalB,
        "fri" : genericFriday,
        "sat" : noSchool,
        "sun" : noSchool
    };

    var daysOff = [];

    // Summer
    var summerStart = new Date(2015, 6, 4);
    var summerEnd = new Date(2015, 8, 24);
    daysOff.push(getAllDays(summerStart, summerEnd));



    $(document).ready(function() {
        updateHTML();
        setInterval(updateHTML, 100);
    });

    function updateHTML() {
        var $minsRemainingLbl = $('.mins-remaining');
        $minsRemainingLbl.text(minsRemaining());

        if(currentSchedule() === noSchool || currentPeriod() === noSchool){
            $(".in-schedule").hide();
            $(".no-schedule").show();
            $(".lower .title").text("normal schedule");
        } else {
            $(".in-schedule").show();
            $(".no-schedule").hide();
            $(".lower .title").text("today\'s schedule");
        }

        updateScheduleHTML();

        // Update Schedule Info
        $(".cur-schedule").text(currentSchedule().name);

        // Update Period Info
        
        // Current Period
        var curPeriod = currentPeriod();
        
        $("#in").text(curPeriod.name);
        $("#started").text(convertTime(curPeriod.start));

        // Next Period
        if(nextPeriod() === noSchool)  {
            $("#next").html("nothing");
            $("#at").html(convertTime(curPeriod.end));
        } else {
            $("#next").text(nextPeriod().name);
            $("#at").text(convertTime(nextPeriod().start));
        }

    }

    function updateScheduleHTML() {
        var curSchedule = currentSchedule();
        var $lowerItems = $(".lower");
        $.each(curSchedule.periods, function(i, period) {
            var periodHTML = '<div class="period"> <div class="container"> <p class="name">'+formatPeriodName(period.name)+'</p> <div class="detail"> <p class="times">'+convertTime(period.start) + ' – ' + convertTime(period.end) + '</p> <p class="length">' + periodLength(period) + ' minutes</p></div> </div></div>';
            $lowerItems.append(periodHTML);
         });
    }

    function minsRemaining() {
        var curPeriod = currentPeriod();

        if (curPeriod.name === "noschool") {
            return 0;
        }

        var curTime = currentTime();
        var remaining = parseTime(curPeriod.end) - curTime;

        return remaining;
    }

    function periodLength(period){
        return parseTime(period.end) - parseTime(period.start);
    }

    function currentPeriod() {
        var curTime = currentTime();
        var curSchedule = currentSchedule();
        if(curSchedule === noSchool){
            return noSchool;
        }
        var curPeriod = noSchool;
            $.each(curSchedule.periods, function(i, period) {
                var start = parseTime(period.start);
                var end = parseTime(period.end);
                if(curTime >= start && curTime < end){
                    curPeriod = period;
                    return false;
                }
            });
        return curPeriod;

    }

    function nextPeriod() {
        var curPeriod = currentPeriod();
        var curSchedule = currentSchedule();
        var periodIndex = $.inArray(curPeriod, curSchedule.periods);

        if(periodIndex === -1 || periodIndex == curSchedule.periods.length - 1) {
            return noSchool;
        }

        return curSchedule.periods[periodIndex+1];
    }

    function inSchool() {

    }

    /**
     * parses time string to total minutes in the day
     * @param  {string} time
     * @return {int}
     */
    function parseTime(time) {
        var split = time.split(":");
        var hours = parseInt(split[0], 10);
        var minutes = parseInt(split[1], 10);

        //total mintues so far
        var totalTime = hours*60 + minutes;
        
        return totalTime;
    }

    /**
     * converts a 24 hour time string to a 12 hour time string
     * @param  {string} time 24 hour time string in the format `hh:mm`
     * @return {string}      12 hour time string in the format `hh:mm`
     */
    function convertTime(time) {
        var split = time.split(':');
        var hour = parseInt(split[0], 10);
        if(hour > 12) {
            hour = hour%12;
        }
        return hour + ":" + split[1];
    }

    function currentTime() {
        var d = new Date();
        return d.getHours()*60 + d.getMinutes();
    }

    function currentSchedule() {
        var days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
        var d = new Date();

        if($.inArray(d, daysOff)) {
            return noSchool;
        }

        var todayInt = d.getDay();
        // console.log(todayInt);
        var today = days[todayInt];

        return week[today];
    }

    function formatPeriodName(period) {
        if (/^\d.*/.test(period)) {
            return period + " period";
        }
        return period;
    }
    /**
     * returns an array of all dates between two dates inclusive
     * @param  {date} start [description]
     * @param  {date} end   [description]
     * @return {array<date>}       [description]
     */
    function getAllDays(start, end) {
        var dates = [];

        while(start <= end) {
            dates.push(start);
            start = new Date(start.setDate(
                start.getDate() + 1
            ));
        }

        return dates;
    }



})(jQuery);